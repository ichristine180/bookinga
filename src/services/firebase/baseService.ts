import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  CollectionReference,
  Query
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface BaseEntity {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}

export class BaseService<T extends BaseEntity> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getCollection(): CollectionReference<DocumentData> {
    return collection(db, this.collectionName);
  }

  protected transformDocument(doc: DocumentSnapshot): T | null {
    if (!doc.exists()) return null;

    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate() || new Date(),
      updatedAt: data?.updatedAt?.toDate() || new Date(),
    } as T;
  }

  protected transformDocuments(snapshot: QuerySnapshot): T[] {
    return snapshot.docs.map(doc => this.transformDocument(doc)).filter(Boolean) as T[];
  }

  async create(data: Partial<T>): Promise<ServiceResponse<T>> {
    try {
      const docData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.getCollection(), docData);
      const newDoc = await this.getById(docRef.id);

      return {
        success: true,
        data: newDoc.data,
      };
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getById(id: string): Promise<ServiceResponse<T>> {
    try {
      const docSnap = await getDocs(query(collection(db, this.collectionName), where('__name__', '==', id)));

      if (!docSnap.empty) {
        const document = docSnap.docs[0];
        const data = this.transformDocument(document);
        return {
          success: true,
          data: data || undefined,
        };
      }

      return {
        success: false,
        error: 'Document not found',
      };
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async update(id: string, data: Partial<T>): Promise<ServiceResponse<T>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await updateDoc(docRef, updateData);
      const updated = await this.getById(id);

      return {
        success: true,
        data: updated.data,
      };
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async delete(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async list(queryOptions?: {
    where?: { field: string; operator: any; value: any }[];
    orderBy?: { field: string; direction: 'asc' | 'desc' };
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<T>>> {
    try {
      let baseQuery: Query = this.getCollection();

      if (queryOptions?.where) {
        queryOptions.where.forEach(condition => {
          baseQuery = query(baseQuery, where(condition.field, condition.operator, condition.value));
        });
      }

      if (queryOptions?.orderBy) {
        baseQuery = query(baseQuery, orderBy(queryOptions.orderBy.field, queryOptions.orderBy.direction));
      }

      if (queryOptions?.limit) {
        baseQuery = query(baseQuery, limit(queryOptions.limit));
      }

      const snapshot = await getDocs(baseQuery);
      const items = this.transformDocuments(snapshot);

      return {
        success: true,
        data: {
          items,
          total: items.length,
        },
      };
    } catch (error) {
      console.error(`Error listing ${this.collectionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}