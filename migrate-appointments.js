import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateAppointments() {
    try {
        console.log('Starting appointment migration...');


        const appointmentsRef = collection(db, 'appointments');
        const snapshot = await getDocs(appointmentsRef);

        console.log(`Found ${snapshot.docs.length} appointments to migrate`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const docSnapshot of snapshot.docs) {
            const data = docSnapshot.data();


            if (data.deleted !== undefined) {
                console.log(`Appointment ${docSnapshot.id} already has deleted field, skipping...`);
                skippedCount++;
                continue;
            }


            await updateDoc(doc(db, 'appointments', docSnapshot.id), {
                deleted: false,
                updatedAt: new Date()
            });

            console.log(`Updated appointment ${docSnapshot.id}`);
            updatedCount++;
        }

        console.log(`Migration completed!`);
        console.log(`Updated: ${updatedCount} appointments`);
        console.log(`Skipped: ${skippedCount} appointments (already had deleted field)`);

    } catch (error) {
        console.error('Migration failed:', error);
    }
}


migrateAppointments(); 