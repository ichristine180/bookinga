interface CountryWithCities {
    code: string;
    name: string;
    dialCode: string;
    flag: string;
    cities: string[];
    phoneLength: {
        mobile: number | number[];
        landline: number | number[];
        min: number;
        max: number;
    };
}

export const countries: CountryWithCities[] = [
    {
        code: 'AF',
        name: 'Afghanistan',
        dialCode: '+93',
        flag: '🇦🇫',
        cities: ['Kabul', 'Kandahar', 'Herat', 'Mazar-i-Sharif', 'Kunduz', 'Jalalabad', 'Lashkar Gah', 'Taloqan', 'Khost', 'Bamyan'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'AL',
        name: 'Albania',
        dialCode: '+355',
        flag: '🇦🇱',
        cities: ['Tirana', 'Durrës', 'Vlorë', 'Elbasan', 'Shkodër', 'Korçë', 'Fier', 'Berat', 'Lushnjë', 'Kavajë'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'DZ',
        name: 'Algeria',
        dialCode: '+213',
        flag: '🇩🇿',
        cities: ['Algiers', 'Oran', 'Constantine', 'Batna', 'Djelfa', 'Sétif', 'Annaba', 'Sidi Bel Abbès', 'Biskra', 'Tébessa'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'AS',
        name: 'American Samoa',
        dialCode: '+1684',
        flag: '🇦🇸',
        cities: ['Pago Pago', 'Tafuna', 'Leone', 'Faleniu', 'Mesepa', 'Ili ili', 'Taulaga', 'Aoa', 'Afono', 'Amanave'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'AD',
        name: 'Andorra',
        dialCode: '+376',
        flag: '🇦🇩',
        cities: ['Andorra la Vella', 'Escaldes-Engordany', 'Encamp', 'Sant Julià de Lòria', 'La Massana', 'Santa Coloma', 'Ordino'],
        phoneLength: { mobile: 6, landline: 6, min: 6, max: 6 }
    },
    {
        code: 'AO',
        name: 'Angola',
        dialCode: '+244',
        flag: '🇦🇴',
        cities: ['Luanda', 'Huambo', 'Lobito', 'Benguela', 'Kuito', 'Lubango', 'Malanje', 'Namibe', 'Soyo', 'Cabinda'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'AG',
        name: 'Antigua and Barbuda',
        dialCode: '+1268',
        flag: '🇦🇬',
        cities: ["Saint John's", 'All Saints', 'Liberta', 'Potter Village', 'Bolans', 'Swetes', 'Seaview Farm', 'Pigotts', 'Parham', 'English Harbour'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'AR',
        name: 'Argentina',
        dialCode: '+54',
        flag: '🇦🇷',
        cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Tucumán', 'La Plata', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan'],
        phoneLength: { mobile: [6, 7, 8], landline: [6, 7, 8], min: 6, max: 8 }
    },
    {
        code: 'AM',
        name: 'Armenia',
        dialCode: '+374',
        flag: '🇦🇲',
        cities: ['Yerevan', 'Gyumri', 'Vanadzor', 'Vagharshapat', 'Abovyan', 'Kapan', 'Hrazdan', 'Armavir', 'Artashat', 'Goris'],
        phoneLength: { mobile: 6, landline: 6, min: 6, max: 6 }
    },
    {
        code: 'AU',
        name: 'Australia',
        dialCode: '+61',
        flag: '🇦🇺',
        cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Central Coast', 'Wollongong'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'AT',
        name: 'Austria',
        dialCode: '+43',
        flag: '🇦🇹',
        cities: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn'],
        phoneLength: { mobile: [10, 11], landline: [10, 11], min: 10, max: 11 }
    },
    {
        code: 'AZ',
        name: 'Azerbaijan',
        dialCode: '+994',
        flag: '🇦🇿',
        cities: ['Baku', 'Ganja', 'Sumqayit', 'Mingachevir', 'Qabalá', 'Lankaran', 'Nakhchivan', 'Shaki', 'Yevlakh', 'Shamakhi'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'BS',
        name: 'Bahamas',
        dialCode: '+1242',
        flag: '🇧🇸',
        cities: ['Nassau', 'Lucaya', 'Freeport', 'West End', 'Cooper\'s Town', 'Marsh Harbour', 'Nicholls Town', 'Dunmore Town', 'Colonel Hill', 'Cockburn Town'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'BH',
        name: 'Bahrain',
        dialCode: '+973',
        flag: '🇧🇭',
        cities: ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'A\'ali', 'Isa Town', 'Sitra', 'Budaiya', 'Jidhafs', 'Al-Malikiyah'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'BD',
        name: 'Bangladesh',
        dialCode: '+880',
        flag: '🇧🇩',
        cities: ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Barisal', 'Rangpur', 'Comilla', 'Narayanganj', 'Gazipur'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'BB',
        name: 'Barbados',
        dialCode: '+1246',
        flag: '🇧🇧',
        cities: ['Bridgetown', 'Speightstown', 'Oistins', 'Bathsheba', 'Holetown', 'Lawrence Gap', 'Six Cross Roads', 'Crane', 'Saint Lawrence Gap', 'Worthing'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'BY',
        name: 'Belarus',
        dialCode: '+375',
        flag: '🇧🇾',
        cities: ['Minsk', 'Homel', 'Mahilyow', 'Vitebsk', 'Hrodna', 'Brest', 'Babruysk', 'Baranovichi', 'Barysaw', 'Pinsk'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'BE',
        name: 'Belgium',
        dialCode: '+32',
        flag: '🇧🇪',
        cities: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'BZ',
        name: 'Belize',
        dialCode: '+501',
        flag: '🇧🇿',
        cities: ['Belize City', 'San Ignacio', 'Orange Walk', 'Corozal', 'Dangriga', 'Benque Viejo del Carmen', 'San Pedro', 'Punta Gorda', 'Placencia', 'Hopkins'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'BJ',
        name: 'Benin',
        dialCode: '+229',
        flag: '🇧🇯',
        cities: ['Cotonou', 'Abomey-Calavi', 'Djougou', 'Porto-Novo', 'Parakou', 'Kandi', 'Abomey', 'Natitingou', 'Lokossa', 'Ouidah'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'BT',
        name: 'Bhutan',
        dialCode: '+975',
        flag: '🇧🇹',
        cities: ['Thimphu', 'Phuntsholing', 'Punakha', 'Wangdue Phodrang', 'Samdrup Jongkhar', 'Mongar', 'Tashigang', 'Geylegphug', 'Bajo', 'Damphu'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'BO',
        name: 'Bolivia',
        dialCode: '+591',
        flag: '🇧🇴',
        cities: ['Santa Cruz de la Sierra', 'El Alto', 'La Paz', 'Cochabamba', 'Sucre', 'Tarija', 'Potosí', 'Oruro', 'Trinidad', 'Cobija'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'BA',
        name: 'Bosnia and Herzegovina',
        dialCode: '+387',
        flag: '🇧🇦',
        cities: ['Sarajevo', 'Banja Luka', 'Tuzla', 'Zenica', 'Mostar', 'Prijedor', 'Brčko', 'Bijeljina', 'Trebinje', 'Cazin'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'BW',
        name: 'Botswana',
        dialCode: '+267',
        flag: '🇧🇼',
        cities: ['Gaborone', 'Francistown', 'Molepolole', 'Maun', 'Serowe', 'Selibe Phikwe', 'Kanye', 'Mochudi', 'Mahalapye', 'Palapye'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'BR',
        name: 'Brazil',
        dialCode: '+55',
        flag: '🇧🇷',
        cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Goiânia'],
        phoneLength: { mobile: 11, landline: 10, min: 10, max: 11 }
    },
    {
        code: 'BN',
        name: 'Brunei',
        dialCode: '+673',
        flag: '🇧🇳',
        cities: ['Bandar Seri Begawan', 'Kuala Belait', 'Seria', 'Tutong', 'Bangar', 'Muara', 'Sukang', 'Labi', 'Lumut', 'Wasan'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'BG',
        name: 'Bulgaria',
        dialCode: '+359',
        flag: '🇧🇬',
        cities: ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven', 'Sliven', 'Dobrich', 'Shumen'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'BF',
        name: 'Burkina Faso',
        dialCode: '+226',
        flag: '🇧🇫',
        cities: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora', 'Ouahigouya', 'Pouytenga', 'Kaya', 'Tenkodogo', 'Orodara', 'Fada N\'gourma'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'BI',
        name: 'Burundi',
        dialCode: '+257',
        flag: '🇧🇮',
        cities: ['Bujumbura', 'Gitega', 'Muyinga', 'Ruyigi', 'Kayanza', 'Ngozi', 'Bururi', 'Rutana', 'Makamba', 'Cibitoke'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'CV',
        name: 'Cape Verde',
        dialCode: '+238',
        flag: '🇨🇻',
        cities: ['Praia', 'Mindelo', 'Santa Maria', 'Assomada', 'Porto Novo', 'Espargos', 'Ribeira Grande', 'Pedra Badejo', 'São Filipe', 'Tarrafal'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'KH',
        name: 'Cambodia',
        dialCode: '+855',
        flag: '🇰🇭',
        cities: ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Poipet', 'Kampong Cham', 'Ta Khmau', 'Pursat', 'Kampong Speu', 'Kampot'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'CM',
        name: 'Cameroon',
        dialCode: '+237',
        flag: '🇨🇲',
        cities: ['Douala', 'Yaoundé', 'Garoua', 'Kousseri', 'Bamenda', 'Maroua', 'Bafoussam', 'Mokolo', 'Ngaoundéré', 'Bertoua'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'CA',
        name: 'Canada',
        dialCode: '+1',
        flag: '🇨🇦',
        cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'CF',
        name: 'Central African Republic',
        dialCode: '+236',
        flag: '🇨🇫',
        cities: ['Bangui', 'Bimbo', 'Berbérati', 'Carnot', 'Bambari', 'Bouar', 'Bossangoa', 'Bria', 'Bangassou', 'Nola'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'TD',
        name: 'Chad',
        dialCode: '+235',
        flag: '🇹🇩',
        cities: ["N'Djamena", 'Moundou', 'Sarh', 'Abéché', 'Kélo', 'Koumra', 'Pala', 'Am Timan', 'Bongor', 'Mongo'],
        phoneLength: { mobile: 6, landline: 6, min: 6, max: 6 }
    },
    {
        code: 'CL',
        name: 'Chile',
        dialCode: '+56',
        flag: '🇨🇱',
        cities: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Rancagua', 'Talca', 'Arica', 'Chillán'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'CN',
        name: 'China',
        dialCode: '+86',
        flag: '🇨🇳',
        cities: ['Shanghai', 'Beijing', 'Chongqing', 'Tianjin', 'Guangzhou', 'Shenzhen', 'Wuhan', 'Dongguan', 'Chengdu', 'Nanjing'],
        phoneLength: { mobile: 11, landline: 11, min: 10, max: 11 }
    },
    {
        code: 'CO',
        name: 'Colombia',
        dialCode: '+57',
        flag: '🇨🇴',
        cities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'KM',
        name: 'Comoros',
        dialCode: '+269',
        flag: '🇰🇲',
        cities: ['Moroni', 'Moutsamoudou', 'Fomboni', 'Domoni', 'Sima', 'Mirontsy', 'Foumbouni', 'Tsimbeo', 'Adda-Douéni', 'Ouani'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'CG',
        name: 'Congo',
        dialCode: '+242',
        flag: '🇨🇬',
        cities: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Impfondo', 'Ouesso', 'Madingou', 'Owando', 'Sibiti', 'Mossendjo'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'CD',
        name: 'Congo (DRC)',
        dialCode: '+243',
        flag: '🇨🇩',
        cities: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kisangani', 'Masina', 'Kananga', 'Likasi', 'Kolwezi', 'Tshikapa', 'Beni'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'CR',
        name: 'Costa Rica',
        dialCode: '+506',
        flag: '🇨🇷',
        cities: ['San José', 'San Francisco', 'Cartago', 'Puntarenas', 'Limón', 'Alajuela', 'Desamparados', 'Paraíso', 'San Isidro', 'Curridabat'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'CI',
        name: 'Côte d\'Ivoire',
        dialCode: '+225',
        flag: '🇨🇮',
        cities: ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'San-Pédro', 'Divo', 'Korhogo', 'Anyama', 'Gagnoa', 'Man'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'HR',
        name: 'Croatia',
        dialCode: '+385',
        flag: '🇭🇷',
        cities: ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar', 'Slavonski Brod', 'Pula', 'Sesvete', 'Karlovac', 'Varaždin'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'CU',
        name: 'Cuba',
        dialCode: '+53',
        flag: '🇨🇺',
        cities: ['Havana', 'Santiago de Cuba', 'Camagüey', 'Holguín', 'Guantánamo', 'Santa Clara', 'Las Tunas', 'Bayamo', 'Cienfuegos', 'Pinar del Río'],
        phoneLength: { mobile: 8, landline: 8, min: 7, max: 8 }
    },
    {
        code: 'CY',
        name: 'Cyprus',
        dialCode: '+357',
        flag: '🇨🇾',
        cities: ['Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Famagusta', 'Kyrenia', 'Protaras', 'Paralimni', 'Agia Napa', 'Polis'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'CZ',
        name: 'Czech Republic',
        dialCode: '+420',
        flag: '🇨🇿',
        cities: ['Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'Ústí nad Labem', 'České Budějovice', 'Hradec Králové', 'Pardubice'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'DK',
        name: 'Denmark',
        dialCode: '+45',
        flag: '🇩🇰',
        cities: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'DJ',
        name: 'Djibouti',
        dialCode: '+253',
        flag: '🇩🇯',
        cities: ['Djibouti', 'Ali Sabieh', 'Dikhil', 'Tadjoura', 'Obock', 'Arta', 'Holhol', 'Yoboki', 'Randa', 'Galafi'],
        phoneLength: { mobile: 10, landline: 10, min: 8, max: 10 }
    },
    {
        code: 'DM',
        name: 'Dominica',
        dialCode: '+1767',
        flag: '🇩🇲',
        cities: ['Roseau', 'Portsmouth', 'Marigot', 'Berekua', 'Mahaut', 'Saint Joseph', 'Canefield', 'Soufrière', 'La Plaine', 'Grand Bay'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'DO',
        name: 'Dominican Republic',
        dialCode: '+1809',
        flag: '🇩🇴',
        cities: ['Santo Domingo', 'Santiago', 'Santo Domingo Oeste', 'Santo Domingo Este', 'San Pedro de Macorís', 'La Romana', 'San Francisco de Macorís', 'Puerto Plata', 'San Cristóbal', 'Higüey'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'EC',
        name: 'Ecuador',
        dialCode: '+593',
        flag: '🇪🇨',
        cities: ['Guayaquil', 'Quito', 'Cuenca', 'Santo Domingo', 'Machala', 'Durán', 'Manta', 'Portoviejo', 'Ambato', 'Riobamba'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'EG',
        name: 'Egypt',
        dialCode: '+20',
        flag: '🇪🇬',
        cities: ['Cairo', 'Alexandria', 'Giza', 'Shubra El-Kheima', 'Port Said', 'Suez', 'Luxor', 'al-Mansura', 'El-Mahalla El-Kubra', 'Tanta'],
        phoneLength: { mobile: 10, landline: 10, min: 9, max: 10 }
    },
    {
        code: 'SV',
        name: 'El Salvador',
        dialCode: '+503',
        flag: '🇸🇻',
        cities: ['San Salvador', 'Soyapango', 'Santa Ana', 'San Miguel', 'Mejicanos', 'Apopa', 'Delgado', 'Ilopango', 'Cojutepeque', 'Ahuachapán'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'GQ',
        name: 'Equatorial Guinea',
        dialCode: '+240',
        flag: '🇬🇶',
        cities: ['Malabo', 'Bata', 'Ebebiyin', 'Aconibe', 'Añisoc', 'Luba', 'Evinayong', 'Mongomo', 'Mengomeyén', 'Ayene'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'ER',
        name: 'Eritrea',
        dialCode: '+291',
        flag: '🇪🇷',
        cities: ['Asmara', 'Keren', 'Massawa', 'Assab', 'Mendefera', 'Barentu', 'Adi Keih', 'Adi Quala', 'Dekemhare', 'Ak\'ordat'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'EE',
        name: 'Estonia',
        dialCode: '+372',
        flag: '🇪🇪',
        cities: ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi', 'Rakvere', 'Sillamäe', 'Maardu', 'Kuressaare'],
        phoneLength: { mobile: 8, landline: 8, min: 7, max: 8 }
    },
    {
        code: 'ET',
        name: 'Ethiopia',
        dialCode: '+251',
        flag: '🇪🇹',
        cities: ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Adama', 'Awasa', 'Bahir Dar', 'Gondar', 'Dessie', 'Jimma', 'Jijiga'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'FJ',
        name: 'Fiji',
        dialCode: '+679',
        flag: '🇫🇯',
        cities: ['Suva', 'Nasinu', 'Lautoka', 'Nadi', 'Labasa', 'Ba', 'Tavua', 'Vatukoula', 'Rakiraki', 'Levuka'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'FI',
        name: 'Finland',
        dialCode: '+358',
        flag: '🇫🇮',
        cities: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori'],
        phoneLength: { mobile: [9, 10, 11], landline: [9, 10, 11], min: 9, max: 11 }
    },
    {
        code: 'FR',
        name: 'France',
        dialCode: '+33',
        flag: '🇫🇷',
        cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'GA',
        name: 'Gabon',
        dialCode: '+241',
        flag: '🇬🇦',
        cities: ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Mouila', 'Lambaréné', 'Tchibanga', 'Koulamoutou', 'Makokou'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'GM',
        name: 'Gambia',
        dialCode: '+220',
        flag: '🇬🇲',
        cities: ['Banjul', 'Serekunda', 'Brikama', 'Bakau', 'Farafenni', 'Lamin', 'Sukuta', 'Gunjur', 'Basse Santa Su', 'Janjanbureh'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'GE',
        name: 'Georgia',
        dialCode: '+995',
        flag: '🇬🇪',
        cities: ['Tbilisi', 'Kutaisi', 'Batumi', 'Rustavi', 'Zugdidi', 'Gori', 'Poti', 'Kobuleti', 'Khashuri', 'Samtredia'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'DE',
        name: 'Germany',
        dialCode: '+49',
        flag: '🇩🇪',
        cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 11 }
    },
    {
        code: 'GH',
        name: 'Ghana',
        dialCode: '+233',
        flag: '🇬🇭',
        cities: ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Atsiaman', 'Tema', 'Teshi Old Town', 'Cape Coast', 'Sekondi-Takoradi', 'Obuasi'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'GR',
        name: 'Greece',
        dialCode: '+30',
        flag: '🇬🇷',
        cities: ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Ioannina', 'Kavala', 'Chania', 'Chalcis'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'GD',
        name: 'Grenada',
        dialCode: '+1473',
        flag: '🇬🇩',
        cities: ["Saint George's", 'Gouyave', 'Grenville', 'Victoria', 'Saint David\'s', 'Sauteurs', 'Hillsborough', 'Woburn', 'Saint Andrew\'s', 'Marquis'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'GT',
        name: 'Guatemala',
        dialCode: '+502',
        flag: '🇬🇹',
        cities: ['Guatemala City', 'Mixco', 'Villa Nueva', 'Petapa', 'San Juan Sacatepéquez', 'Quetzaltenango', 'Villa Canales', 'Escuintla', 'Chinautla', 'Chimaltenango'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'GN',
        name: 'Guinea',
        dialCode: '+224',
        flag: '🇬🇳',
        cities: ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labe', 'Mamou', 'Boke', 'Guéckédou', 'Kissidougou', 'Dabola'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'GW',
        name: 'Guinea-Bissau',
        dialCode: '+245',
        flag: '🇬🇼',
        cities: ['Bissau', 'Gabu', 'Bafatá', 'Bissorã', 'Bolama', 'Cacheu', 'Catió', 'Canchungo', 'Fulacunda', 'Mansôa'],
        phoneLength: { mobile: 9, landline: 9, min: 7, max: 9 }
    },
    {
        code: 'GY',
        name: 'Guyana',
        dialCode: '+592',
        flag: '🇬🇾',
        cities: ['Georgetown', 'Linden', 'New Amsterdam', 'Anna Regina', 'Bartica', 'Skeldon', 'Rosignol', 'Parika', 'Mahaica', 'Mabaruma'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'HT',
        name: 'Haiti',
        dialCode: '+509',
        flag: '🇭🇹',
        cities: ['Port-au-Prince', 'Cap-Haïtien', 'Gonaïves', 'Les Cayes', 'Delmas', 'Pétion-Ville', 'Carrefour', 'Fort-de-Paix', 'Jacmel', 'Jérémie'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'HN',
        name: 'Honduras',
        dialCode: '+504',
        flag: '🇭🇳',
        cities: ['Tegucigalpa', 'San Pedro Sula', 'La Ceiba', 'El Progreso', 'Choluteca', 'Comayagua', 'Puerto Cortés', 'Danlí', 'Siguatepeque', 'Juticalpa'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'HU',
        name: 'Hungary',
        dialCode: '+36',
        flag: '🇭🇺',
        cities: ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szombathely'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'IS',
        name: 'Iceland',
        dialCode: '+354',
        flag: '🇮🇸',
        cities: ['Reykjavík', 'Kópavogur', 'Hafnarfjörður', 'Akureyri', 'Garðabær', 'Mosfellsbær', 'Árborg', 'Akranes', 'Fjarðabyggð', 'Selfoss'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'IN',
        name: 'India',
        dialCode: '+91',
        flag: '🇮🇳',
        cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'ID',
        name: 'Indonesia',
        dialCode: '+62',
        flag: '🇮🇩',
        cities: ['Jakarta', 'Surabaya', 'Bandung', 'Bekasi', 'Medan', 'Depok', 'Tangerang', 'Palembang', 'Semarang', 'Makassar'],
        phoneLength: { mobile: 11, landline: 11, min: 10, max: 11 }
    },
    {
        code: 'IR',
        name: 'Iran',
        dialCode: '+98',
        flag: '🇮🇷',
        cities: ['Tehran', 'Mashhad', 'Isfahan', 'Karaj', 'Shiraz', 'Tabriz', 'Qom', 'Ahvaz', 'Kermanshah', 'Urmia'],
        phoneLength: { mobile: 11, landline: 11, min: 10, max: 11 }
    },
    {
        code: 'IQ',
        name: 'Iraq',
        dialCode: '+964',
        flag: '🇮🇶',
        cities: ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Najaf', 'Karbala', 'Nasiriyah', 'Amarah', 'Duhok', 'Hillah'],
        phoneLength: { mobile: 10, landline: 10, min: 9, max: 10 }
    },
    {
        code: 'IE',
        name: 'Ireland',
        dialCode: '+353',
        flag: '🇮🇪',
        cities: ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Navan'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'IL',
        name: 'Israel',
        dialCode: '+972',
        flag: '🇮🇱',
        cities: ['Jerusalem', 'Tel Aviv', 'Haifa', 'Rishon LeZion', 'Petah Tikva', 'Ashdod', 'Netanya', 'Beer Sheva', 'Holon', 'Bnei Brak'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'IT',
        name: 'Italy',
        dialCode: '+39',
        flag: '🇮🇹',
        cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania'],
        phoneLength: { mobile: 10, landline: 10, min: 9, max: 10 }
    },
    {
        code: 'JM',
        name: 'Jamaica',
        dialCode: '+1876',
        flag: '🇯🇲',
        cities: ['Kingston', 'Spanish Town', 'Portmore', 'Montego Bay', 'May Pen', 'Mandeville', 'Old Harbour', 'Savanna-la-Mar', 'Linstead', 'Half Way Tree'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'JP',
        name: 'Japan',
        dialCode: '+81',
        flag: '🇯🇵',
        cities: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kawasaki', 'Kyoto', 'Saitama'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 11 }
    },
    {
        code: 'JO',
        name: 'Jordan',
        dialCode: '+962',
        flag: '🇯🇴',
        cities: ['Amman', 'Zarqa', 'Irbid', 'Russeifa', 'Wadi as-Sir', 'Aqaba', 'Madaba', 'as-Salt', 'Mafraq', 'Jerash'],
        phoneLength: { mobile: [8, 9], landline: [8, 9], min: 8, max: 9 }
    },
    {
        code: 'KZ',
        name: 'Kazakhstan',
        dialCode: '+7',
        flag: '🇰🇿',
        cities: ['Almaty', 'Nur-Sultan', 'Shymkent', 'Aktobe', 'Taraz', 'Pavlodar', 'Ust-Kamenogorsk', 'Karaganda', 'Semey', 'Atyrau'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'KE',
        name: 'Kenya',
        dialCode: '+254',
        flag: '🇰🇪',
        cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Nyeri', 'Machakos', 'Meru', 'Thika', 'Kitale'],
        phoneLength: { mobile: 10, landline: 10, min: 9, max: 10 }
    },
    {
        code: 'KI',
        name: 'Kiribati',
        dialCode: '+686',
        flag: '🇰🇮',
        cities: ['South Tarawa', 'Betio', 'Bikenibeu', 'Teaoraereke', 'Bairiki', 'Bonriki', 'Buota', 'Nawerewere', 'Tanaea', 'Taborio'],
        phoneLength: { mobile: 8, landline: 8, min: 5, max: 8 }
    },
    {
        code: 'KP',
        name: 'North Korea',
        dialCode: '+850',
        flag: '🇰🇵',
        cities: ['Pyongyang', 'Hamhung', 'Chongjin', 'Nampo', 'Wonsan', 'Sinuiju', 'Tanchon', 'Kaechon', 'Kaesong', 'Sariwon'],
        phoneLength: { mobile: [4, 6, 7, 13], landline: [4, 6, 7, 13], min: 4, max: 13 }
    },
    {
        code: 'KR',
        name: 'South Korea',
        dialCode: '+82',
        flag: '🇰🇷',
        cities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Goyang'],
        phoneLength: { mobile: [7, 8], landline: [7, 8], min: 7, max: 8 }
    },
    {
        code: 'KW',
        name: 'Kuwait',
        dialCode: '+965',
        flag: '🇰🇼',
        cities: ['Kuwait City', 'Al Ahmadi', 'Hawalli', 'As Salimiyah', 'Sabah as Salim', 'Al Farwaniyah', 'Al Fahahil', 'Ar Riqqah', 'Salwa', 'Jaber Al-Ali'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'KG',
        name: 'Kyrgyzstan',
        dialCode: '+996',
        flag: '🇰🇬',
        cities: ['Bishkek', 'Osh', 'Jalal-Abad', 'Karakol', 'Tokmok', 'Uzgen', 'Naryn', 'Talas', 'Batken', 'Kant'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'LA',
        name: 'Laos',
        dialCode: '+856',
        flag: '🇱🇦',
        cities: ['Vientiane', 'Savannakhet', 'Pakse', 'Luang Prabang', 'Thakhek', 'Xam Neua', 'Muang Xay', 'Phonsavan', 'Muang Pakxan', 'Attapeu'],
        phoneLength: { mobile: [8, 9], landline: [8, 9], min: 8, max: 9 }
    },
    {
        code: 'LV',
        name: 'Latvia',
        dialCode: '+371',
        flag: '🇱🇻',
        cities: ['Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Ventspils', 'Rēzekne', 'Valmiera', 'Jēkabpils', 'Ogre'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'LB',
        name: 'Lebanon',
        dialCode: '+961',
        flag: '🇱🇧',
        cities: ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Nabatieh', 'Jounieh', 'Zahle', 'Baalbek', 'Byblos', 'Aley'],
        phoneLength: { mobile: [7, 8], landline: [7, 8], min: 7, max: 8 }
    },
    {
        code: 'LS',
        name: 'Lesotho',
        dialCode: '+266',
        flag: '🇱🇸',
        cities: ['Maseru', 'Teyateyaneng', 'Mafeteng', 'Hlotse', 'Mohale\'s Hoek', 'Maputsoe', 'Qacha\'s Nek', 'Quthing', 'Butha-Buthe', 'Mokhotlong'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'LR',
        name: 'Liberia',
        dialCode: '+231',
        flag: '🇱🇷',
        cities: ['Monrovia', 'Gbarnga', 'Kakata', 'Bensonville', 'Harper', 'Voinjama', 'Buchanan', 'Zwedru', 'New Kru Town', 'Pleebo'],
        phoneLength: { mobile: [8, 9], landline: [8, 9], min: 8, max: 9 }
    },
    {
        code: 'LY',
        name: 'Libya',
        dialCode: '+218',
        flag: '🇱🇾',
        cities: ['Tripoli', 'Benghazi', 'Misrata', 'Tarhuna', 'Al Khums', 'Az Zawiyah', 'Ajdabiya', 'Tobruk', 'Sabha', 'Bayda'],
        phoneLength: { mobile: 10, landline: 10, min: 9, max: 10 }
    },
    {
        code: 'LI',
        name: 'Liechtenstein',
        dialCode: '+423',
        flag: '🇱🇮',
        cities: ['Vaduz', 'Schaan', 'Balzers', 'Triesen', 'Eschen', 'Mauren', 'Triesenberg', 'Ruggell', 'Gamprin', 'Schellenberg'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'LT',
        name: 'Lithuania',
        dialCode: '+370',
        flag: '🇱🇹',
        cities: ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus', 'Marijampolė', 'Mažeikiai', 'Jonava', 'Utena'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'LU',
        name: 'Luxembourg',
        dialCode: '+352',
        flag: '🇱🇺',
        cities: ['Luxembourg', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Ettelbruck', 'Diekirch', 'Strassen', 'Bertrange', 'Bettembourg', 'Schifflange'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'MG',
        name: 'Madagascar',
        dialCode: '+261',
        flag: '🇲🇬',
        cities: ['Antananarivo', 'Toamasina', 'Antsirabe', 'Fianarantsoa', 'Mahajanga', 'Toliara', 'Antsiranana', 'Ambovombe', 'Ambatondrazaka', 'Morondava'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'MW',
        name: 'Malawi',
        dialCode: '+265',
        flag: '🇲🇼',
        cities: ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Kasungu', 'Mangochi', 'Karonga', 'Salima', 'Liwonde', 'Nkhotakota'],
        phoneLength: { mobile: [7, 8, 9], landline: [7, 8, 9], min: 7, max: 9 }
    },
    {
        code: 'MY',
        name: 'Malaysia',
        dialCode: '+60',
        flag: '🇲🇾',
        cities: ['Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Johor Bahru', 'Seberang Perai', 'Kuching', 'Kota Kinabalu', 'Subang Jaya'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 9 }
    },
    {
        code: 'MV',
        name: 'Maldives',
        dialCode: '+960',
        flag: '🇲🇻',
        cities: ['Malé', 'Addu City', 'Fuvahmulah', 'Kulhudhuffushi', 'Thinadhoo', 'Ungoofaaru', 'Naifaru', 'Dhidhdhoo', 'Maradhoo', 'Veymandoo'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'ML',
        name: 'Mali',
        dialCode: '+223',
        flag: '🇲🇱',
        cities: ['Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Ségou', 'Kayes', 'Gao', 'Kati', 'Tombouctou', 'Markala'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'MT',
        name: 'Malta',
        dialCode: '+356',
        flag: '🇲🇹',
        cities: ['Valletta', 'Birkirkara', 'Mosta', 'Qormi', 'Żabbar', 'San Pawl il-Baħar', 'Sliema', 'Żejtun', 'Ħamrun', 'Naxxar'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'MH',
        name: 'Marshall Islands',
        dialCode: '+692',
        flag: '🇲🇭',
        cities: ['Majuro', 'Kwajalein', 'Ebeye', 'Arno', 'Mili', 'Wotje', 'Jaluit', 'Ailinglaplap', 'Likiep', 'Namu'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'MU',
        name: 'Mauritius',
        dialCode: '+230',
        flag: '🇲🇺',
        cities: ['Port Louis', 'Beau Bassin-Rose Hill', 'Vacoas-Phoenix', 'Curepipe', 'Quatre Bornes', 'Triolet', 'Goodlands', 'Centre de Flacq', 'Saint Pierre', 'Pamplemousses'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'MX',
        name: 'Mexico',
        dialCode: '+52',
        flag: '🇲🇽',
        cities: ['Mexico City', 'Ecatepec', 'Guadalajara', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Zapopan', 'Monterrey', 'Nezahualcóyotl'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'FM',
        name: 'Micronesia',
        dialCode: '+691',
        flag: '🇫🇲',
        cities: ['Palikir', 'Weno', 'Tofol', 'Colonia', 'Nett', 'Kitti', 'Madolenihmw', 'Uh', 'Sokehs', 'Nankaku'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'MD',
        name: 'Moldova',
        dialCode: '+373',
        flag: '🇲🇩',
        cities: ['Chișinău', 'Tiraspol', 'Bălți', 'Bender', 'Rîbnița', 'Cahul', 'Ungheni', 'Soroca', 'Orhei', 'Comrat'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'MC',
        name: 'Monaco',
        dialCode: '+377',
        flag: '🇲🇨',
        cities: ['Monaco', 'Monte Carlo', 'La Condamine', 'Fontvieille', 'Monaco-Ville', 'Moneghetti', 'Saint-Roman', 'Larvotto', 'La Rousse', 'Les Moulins'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'MN',
        name: 'Mongolia',
        dialCode: '+976',
        flag: '🇲🇳',
        cities: ['Ulaanbaatar', 'Erdenet', 'Darkhan', 'Choibalsan', 'Murun', 'Bayankhongor', 'Mandalgovi', 'Ulaangom', 'Khovd', 'Arvayheer'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'ME',
        name: 'Montenegro',
        dialCode: '+382',
        flag: '🇲🇪',
        cities: ['Podgorica', 'Nikšić', 'Pljevlja', 'Bijelo Polje', 'Cetinje', 'Bar', 'Herceg Novi', 'Berane', 'Budva', 'Ulcinj'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'MA',
        name: 'Morocco',
        dialCode: '+212',
        flag: '🇲🇦',
        cities: ['Casablanca', 'Rabat', 'Fez', 'Marrakech', 'Agadir', 'Tangier', 'Meknès', 'Oujda', 'Kenitra', 'Tetouan'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'MZ',
        name: 'Mozambique',
        dialCode: '+258',
        flag: '🇲🇿',
        cities: ['Maputo', 'Matola', 'Beira', 'Nampula', 'Chimoio', 'Nacala', 'Quelimane', 'Tete', 'Xai-Xai', 'Lichinga'],
        phoneLength: { mobile: 12, landline: 9, min: 9, max: 12 }
    },
    {
        code: 'MM',
        name: 'Myanmar',
        dialCode: '+95',
        flag: '🇲🇲',
        cities: ['Yangon', 'Mandalay', 'Naypyidaw', 'Mawlamyine', 'Bago', 'Pathein', 'Monywa', 'Meiktila', 'Myitkyina', 'Taunggyi'],
        phoneLength: { mobile: [7, 8, 9, 10], landline: [7, 8, 9, 10], min: 7, max: 10 }
    },
    {
        code: 'NA',
        name: 'Namibia',
        dialCode: '+264',
        flag: '🇳🇦',
        cities: ['Windhoek', 'Rundu', 'Walvis Bay', 'Oshakati', 'Swakopmund', 'Katima Mulilo', 'Grootfontein', 'Rehoboth', 'Otjiwarongo', 'Okahandja'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'NR',
        name: 'Nauru',
        dialCode: '+674',
        flag: '🇳🇷',
        cities: ['Yaren', 'Baiti', 'Anabar', 'Anetan', 'Anibare', 'Boe', 'Buada', 'Denigomodu', 'Ewa', 'Ijuw'],
        phoneLength: { mobile: 7, landline: 7, min: 4, max: 7 }
    },
    {
        code: 'NP',
        name: 'Nepal',
        dialCode: '+977',
        flag: '🇳🇵',
        cities: ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bharatpur', 'Biratnagar', 'Birgunj', 'Dharan', 'Bhaktapur', 'Butwal', 'Hetauda'],
        phoneLength: { mobile: 10, landline: 10, min: 8, max: 10 }
    },
    {
        code: 'NL',
        name: 'Netherlands',
        dialCode: '+31',
        flag: '🇳🇱',
        cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'NZ',
        name: 'New Zealand',
        dialCode: '+64',
        flag: '🇳🇿',
        cities: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Napier-Hastings', 'Dunedin', 'Palmerston North', 'Nelson', 'Rotorua'],
        phoneLength: { mobile: [8, 9], landline: [8, 9], min: 8, max: 9 }
    },
    {
        code: 'NI',
        name: 'Nicaragua',
        dialCode: '+505',
        flag: '🇳🇮',
        cities: ['Managua', 'León', 'Masaya', 'Matagalpa', 'Chinandega', 'Granada', 'Jinotega', 'Estelí', 'Corinto', 'Bluefields'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'NE',
        name: 'Niger',
        dialCode: '+227',
        flag: '🇳🇪',
        cities: ['Niamey', 'Zinder', 'Maradi', 'Agadez', 'Tahoua', 'Dosso', 'Arlit', 'Tillabéri', 'Diffa', 'Téra'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'NG',
        name: 'Nigeria',
        dialCode: '+234',
        flag: '🇳🇬',
        cities: ['Lagos', 'Kano', 'Ibadan', 'Abuja', 'Port Harcourt', 'Benin City', 'Maiduguri', 'Zaria', 'Aba', 'Jos'],
        phoneLength: { mobile: 10, landline: 8, min: 8, max: 10 }
    },
    {
        code: 'MK',
        name: 'North Macedonia',
        dialCode: '+389',
        flag: '🇲🇰',
        cities: ['Skopje', 'Kumanovo', 'Prilep', 'Tetovo', 'Veles', 'Štip', 'Ohrid', 'Gostivar', 'Strumica', 'Kavadarci'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'NO',
        name: 'Norway',
        dialCode: '+47',
        flag: '🇳🇴',
        cities: ['Oslo', 'Bergen', 'Stavanger', 'Trondheim', 'Drammen', 'Fredrikstad', 'Kristiansand', 'Sandnes', 'Tromsø', 'Sarpsborg'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'OM',
        name: 'Oman',
        dialCode: '+968',
        flag: '🇴🇲',
        cities: ['Muscat', 'Seeb', 'Salalah', 'Bawshar', 'Sohar', 'As Suwayq', 'Ibri', 'Saham', 'Barka', 'Rustaq'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'PK',
        name: 'Pakistan',
        dialCode: '+92',
        flag: '🇵🇰',
        cities: ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Hyderabad', 'Gujranwala', 'Peshawar', 'Quetta', 'Islamabad'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'PW',
        name: 'Palau',
        dialCode: '+680',
        flag: '🇵🇼',
        cities: ['Ngerulmud', 'Koror', 'Airai', 'Kloulklubed', 'Ulimang', 'Ngetpang', 'Ngaraard', 'Melekeok', 'Ngchesar', 'Ngaremlengui'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'PA',
        name: 'Panama',
        dialCode: '+507',
        flag: '🇵🇦',
        cities: ['Panama City', 'San Miguelito', 'Tocumen', 'David', 'Arraiján', 'Colón', 'La Chorrera', 'Pacora', 'Penonome', 'Santiago'],
        phoneLength: { mobile: 8, landline: 8, min: 7, max: 8 }
    },
    {
        code: 'PG',
        name: 'Papua New Guinea',
        dialCode: '+675',
        flag: '🇵🇬',
        cities: ['Port Moresby', 'Lae', 'Mount Hagen', 'Popondetta', 'Madang', 'Wewak', 'Vanimo', 'Kimbe', 'Kerema', 'Daru'],
        phoneLength: { mobile: 8, landline: 8, min: 7, max: 8 }
    },
    {
        code: 'PY',
        name: 'Paraguay',
        dialCode: '+595',
        flag: '🇵🇾',
        cities: ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá', 'Lambaré', 'Fernando de la Mora', 'Limpio', 'Ñemby', 'Encarnación'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'PE',
        name: 'Peru',
        dialCode: '+51',
        flag: '🇵🇪',
        cities: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Cusco', 'Chimbote', 'Huancayo', 'Tacna'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'PH',
        name: 'Philippines',
        dialCode: '+63',
        flag: '🇵🇭',
        cities: ['Quezon City', 'Manila', 'Davao City', 'Caloocan', 'Cebu City', 'Zamboanga City', 'Taguig', 'Antipolo', 'Cavite City', 'Tagbilaran'],
        phoneLength: { mobile: 10, landline: 10, min: 7, max: 10 }
    },
    {
        code: 'PL',
        name: 'Poland',
        dialCode: '+48',
        flag: '🇵🇱',
        cities: ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'PT',
        name: 'Portugal',
        dialCode: '+351',
        flag: '🇵🇹',
        cities: ['Lisbon', 'Porto', 'Amadora', 'Braga', 'Setúbal', 'Coimbra', 'Queluz', 'Funchal', 'Cacém', 'Vila Nova de Gaia'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'QA',
        name: 'Qatar',
        dialCode: '+974',
        flag: '🇶🇦',
        cities: ['Doha', 'Al Rayyan', 'Umm Salal', 'Al Wakrah', 'Al Khor', 'Ash Shamal', 'Dukhan', 'Lusail', 'Al Shahaniya', 'Mesaieed'],
        phoneLength: { mobile: 8, landline: 8, min: 7, max: 8 }
    },
    {
        code: 'RO',
        name: 'Romania',
        dialCode: '+40',
        flag: '🇷🇴',
        cities: ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova', 'Brașov', 'Galați', 'Ploiești', 'Oradea'],
        phoneLength: { mobile: 10, landline: 10, min: 9, max: 10 }
    },
    {
        code: 'RU',
        name: 'Russia',
        dialCode: '+7',
        flag: '🇷🇺',
        cities: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Nizhny Novgorod', 'Kazan', 'Chelyabinsk', 'Omsk', 'Samara', 'Rostov-on-Don'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'RW',
        name: 'Rwanda',
        dialCode: '+250',
        flag: '🇷🇼',
        cities: ['Kigali', 'Huye', 'Musanze', 'Rubavu', 'Nyagatare', 'Rusizi', 'Muhanga', 'Kayonza', 'Nyanza', 'Burera', 'Gatsibo', 'Karongi'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'KN',
        name: 'Saint Kitts and Nevis',
        dialCode: '+1869',
        flag: '🇰🇳',
        cities: ['Basseterre', 'Charlestown', 'Monkey Hill', 'Tabernacle', 'Cayon', 'Dieppe Bay Town', 'Sandy Point Town', 'Half Way Tree', 'Saint Paul Capesterre', 'Newton Ground'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'LC',
        name: 'Saint Lucia',
        dialCode: '+1758',
        flag: '🇱🇨',
        cities: ['Castries', 'Bisee', 'Vieux Fort', 'Micoud', 'Soufrière', 'Dennery', 'Gros Islet', 'Choiseul', 'Laborie', 'Canaries'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'VC',
        name: 'Saint Vincent and the Grenadines',
        dialCode: '+1784',
        flag: '🇻🇨',
        cities: ['Kingstown', 'Georgetown', 'Byera', 'Biabou', 'Barrouallie', 'Port Elizabeth', 'Layou', 'Calliaqua', 'Chateaubelair', 'Mesopotamia'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'WS',
        name: 'Samoa',
        dialCode: '+685',
        flag: '🇼🇸',
        cities: ['Apia', 'Asau', 'Mulifanua', 'Leulumoega', 'Lufilufi', 'Nofoalii', 'Safotulafai', 'Lalomalava', 'Salelologa', 'Taga'],
        phoneLength: { mobile: [5, 6, 7], landline: [5, 6, 7], min: 5, max: 7 }
    },
    {
        code: 'SM',
        name: 'San Marino',
        dialCode: '+378',
        flag: '🇸🇲',
        cities: ['Serravalle', 'Borgo Maggiore', 'San Marino', 'Domagnano', 'Fiorentino', 'Acquaviva', 'Faetano', 'Chiesanuova', 'Montegiardino'],
        phoneLength: { mobile: 10, landline: 10, min: 6, max: 10 }
    },
    {
        code: 'ST',
        name: 'São Tomé and Príncipe',
        dialCode: '+239',
        flag: '🇸🇹',
        cities: ['São Tomé', 'Santo António', 'Neves', 'Santana', 'Trindade', 'Santa Cruz', 'Pantufo', 'Guadalupe', 'Santa Catarina', 'Ribeira Afonso'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'SA',
        name: 'Saudi Arabia',
        dialCode: '+966',
        flag: '🇸🇦',
        cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk', 'Buraidah', 'Khamis Mushait', 'Hail'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'SN',
        name: 'Senegal',
        dialCode: '+221',
        flag: '🇸🇳',
        cities: ['Dakar', 'Touba', 'Thiès', 'Kaolack', 'Saint-Louis', 'Mbour', 'Rufisque', 'Ziguinchor', 'Diourbel', 'Tambacounda'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'RS',
        name: 'Serbia',
        dialCode: '+381',
        flag: '🇷🇸',
        cities: ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Zrenjanin', 'Pančevo', 'Čačak', 'Novi Pazar', 'Kraljevo'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'SC',
        name: 'Seychelles',
        dialCode: '+248',
        flag: '🇸🇨',
        cities: ['Victoria', 'Anse Boileau', 'Beau Vallon', 'Cascade', 'Takamaka', 'Port Glaud', 'Grand Anse Mahé', 'English River', 'Anse Royale', 'Mont Fleuri'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'SL',
        name: 'Sierra Leone',
        dialCode: '+232',
        flag: '🇸🇱',
        cities: ['Freetown', 'Bo', 'Kenema', 'Koidu', 'Makeni', 'Lunsar', 'Port Loko', 'Waterloo', 'Kabala', 'Kailahun'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'SG',
        name: 'Singapore',
        dialCode: '+65',
        flag: '🇸🇬',
        cities: ['Singapore', 'Jurong West', 'Woodlands', 'Tampines', 'Sengkang', 'Hougang', 'Yishun', 'Bedok', 'Ang Mo Kio', 'Toa Payoh'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'SK',
        name: 'Slovakia',
        dialCode: '+421',
        flag: '🇸🇰',
        cities: ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica', 'Nitra', 'Trnava', 'Trenčín', 'Martin', 'Poprad'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'SI',
        name: 'Slovenia',
        dialCode: '+386',
        flag: '🇸🇮',
        cities: ['Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Velenje', 'Koper', 'Novo Mesto', 'Ptuj', 'Trbovlje', 'Kamnik'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'SB',
        name: 'Solomon Islands',
        dialCode: '+677',
        flag: '🇸🇧',
        cities: ['Honiara', 'Auki', 'Gizo', 'Munda', 'Noro', 'Tulagi', 'Kirakira', 'Buala', 'Tigoa', 'Lata'],
        phoneLength: { mobile: 7, landline: 7, min: 5, max: 7 }
    },
    {
        code: 'SO',
        name: 'Somalia',
        dialCode: '+252',
        flag: '🇸🇴',
        cities: ['Mogadishu', 'Hargeisa', 'Bosaso', 'Kismayo', 'Merca', 'Galcaio', 'Berbera', 'Baidoa', 'Garowe', 'Jowhar'],
        phoneLength: { mobile: [8, 9], landline: [8, 9], min: 8, max: 9 }
    },
    {
        code: 'ZA',
        name: 'South Africa',
        dialCode: '+27',
        flag: '🇿🇦',
        cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Pietermaritzburg', 'Benoni', 'Tembisa', 'East London', 'Vereeniging'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'SS',
        name: 'South Sudan',
        dialCode: '+211',
        flag: '🇸🇸',
        cities: ['Juba', 'Wau', 'Malakal', 'Yei', 'Aweil', 'Kuacjok', 'Bentiu', 'Rumbek', 'Yambio', 'Bor'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'ES',
        name: 'Spain',
        dialCode: '+34',
        flag: '🇪🇸',
        cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'LK',
        name: 'Sri Lanka',
        dialCode: '+94',
        flag: '🇱🇰',
        cities: ['Colombo', 'Dehiwala-Mount Lavinia', 'Moratuwa', 'Sri Jayawardenepura Kotte', 'Negombo', 'Kandy', 'Kalmunai', 'Trincomalee', 'Galle', 'Jaffna'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'SD',
        name: 'Sudan',
        dialCode: '+249',
        flag: '🇸🇩',
        cities: ['Khartoum', 'Omdurman', 'Khartoum North', 'Port Sudan', 'Kassala', 'Al-Ubayyid', 'Nyala', 'Wad Madani', 'Al-Fashir', 'Kosti'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 9 }
    },
    {
        code: 'SR',
        name: 'Suriname',
        dialCode: '+597',
        flag: '🇸🇷',
        cities: ['Paramaribo', 'Lelydorp', 'Brokopondo', 'Nieuw Nickerie', 'Moengo', 'Mariënburg', 'Wageningen', 'Albina', 'Groningen', 'Brownsweg'],
        phoneLength: { mobile: [6, 7], landline: [6, 7], min: 6, max: 7 }
    },
    {
        code: 'SE',
        name: 'Sweden',
        dialCode: '+46',
        flag: '🇸🇪',
        cities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 9 }
    },
    {
        code: 'CH',
        name: 'Switzerland',
        dialCode: '+41',
        flag: '🇨🇭',
        cities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel/Bienne'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'SY',
        name: 'Syria',
        dialCode: '+963',
        flag: '🇸🇾',
        cities: ['Damascus', 'Aleppo', 'Homs', 'Latakia', 'Hama', 'Deir ez-Zor', 'Raqqa', 'Daraa', 'al-Hasakah', 'Idlib'],
        phoneLength: { mobile: [9, 10], landline: 7, min: 7, max: 10 }
    },
    {
        code: 'TW',
        name: 'Taiwan',
        dialCode: '+886',
        flag: '🇹🇼',
        cities: ['Taipei', 'New Taipei', 'Kaohsiung', 'Taichung', 'Tainan', 'Taoyuan', 'Hsinchu', 'Keelung', 'Hualien', 'Chiayi'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'TJ',
        name: 'Tajikistan',
        dialCode: '+992',
        flag: '🇹🇯',
        cities: ['Dushanbe', 'Khujand', 'Kulob', 'Qurghonteppa', 'Istaravshan', 'Konibodom', 'Vahdat', 'Panjakent', 'Isfara', 'Tursunzoda'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'TZ',
        name: 'Tanzania',
        dialCode: '+255',
        flag: '🇹🇿',
        cities: ['Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Zanzibar City', 'Mbeya', 'Morogoro', 'Tanga', 'Kahama', 'Tabora'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 9 }
    },
    {
        code: 'TH',
        name: 'Thailand',
        dialCode: '+66',
        flag: '🇹🇭',
        cities: ['Bangkok', 'Samut Prakan', 'Mueang Nonthaburi', 'Udon Thani', 'Chon Buri', 'Nakhon Ratchasima', 'Chiang Mai', 'Hat Yai', 'Pak Kret', 'Si Racha'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 9 }
    },
    {
        code: 'TL',
        name: 'Timor-Leste',
        dialCode: '+670',
        flag: '🇹🇱',
        cities: ['Dili', 'Dare', 'Baucau', 'Maliana', 'Suai', 'Aileu', 'Ainaro', 'Same', 'Liquiça', 'Maubisse'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 8 }
    },
    {
        code: 'TG',
        name: 'Togo',
        dialCode: '+228',
        flag: '🇹🇬',
        cities: ['Lomé', 'Sokodé', 'Kara', 'Palimé', 'Atakpamé', 'Bassar', 'Tsévié', 'Aného', 'Sansanné-Mango', 'Dapaong'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'TO',
        name: 'Tonga',
        dialCode: '+676',
        flag: '🇹🇴',
        cities: ["Nuku'alofa", 'Neiafu', 'Haveluliku', 'Vaini', 'Pangai', 'Ohonua', 'Hihifo', "'Ohonua", 'Kolovai', 'Holonga'],
        phoneLength: { mobile: 5, landline: 5, min: 5, max: 7 }
    },
    {
        code: 'TT',
        name: 'Trinidad and Tobago',
        dialCode: '+1868',
        flag: '🇹🇹',
        cities: ['Port of Spain', 'San Fernando', 'Chaguanas', 'Arima', 'Point Fortin', 'Laventille', 'Tunapuna', 'Piarco', 'Princes Town', 'Rio Claro'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'TN',
        name: 'Tunisia',
        dialCode: '+216',
        flag: '🇹🇳',
        cities: ['Tunis', 'Sfax', 'Sousse', 'Ettadhamen', 'Kairouan', 'Gabès', 'Bizerte', 'Ariana', 'Gafsa', 'El Mourouj'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'TR',
        name: 'Turkey',
        dialCode: '+90',
        flag: '🇹🇷',
        cities: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Adana', 'Gaziantep', 'Konya', 'Antalya', 'Kayseri', 'Mersin'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 11 }
    },
    {
        code: 'TM',
        name: 'Turkmenistan',
        dialCode: '+993',
        flag: '🇹🇲',
        cities: ['Ashgabat', 'Turkmenbashi', 'Dashoguz', 'Mary', 'Balkanabat', 'Bayramaly', 'Türkmenabat', 'Tejen', 'Serdar', 'Gumdag'],
        phoneLength: { mobile: 8, landline: 8, min: 8, max: 8 }
    },
    {
        code: 'TV',
        name: 'Tuvalu',
        dialCode: '+688',
        flag: '🇹🇻',
        cities: ['Funafuti', 'Savave', 'Tanrake', 'Toga', 'Amatuku', 'Asau', 'Kulia', 'Lolua', 'Senala', 'Tonga'],
        phoneLength: { mobile: 5, landline: 5, min: 5, max: 6 }
    },
    {
        code: 'UG',
        name: 'Uganda',
        dialCode: '+256',
        flag: '🇺🇬',
        cities: ['Kampala', 'Gulu', 'Lira', 'Mbarara', 'Jinja', 'Bwizibwera', 'Mukono', 'Kasese', 'Masaka', 'Entebbe'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 9 }
    },
    {
        code: 'UA',
        name: 'Ukraine',
        dialCode: '+380',
        flag: '🇺🇦',
        cities: ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Donetsk', 'Zaporizhzhia', 'Lviv', 'Kryvyi Rih', 'Mykolaiv', 'Mariupol'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'AE',
        name: 'United Arab Emirates',
        dialCode: '+971',
        flag: '🇦🇪',
        cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Khor Fakkan', 'Dibba Al-Fujairah'],
        phoneLength: { mobile: 9, landline: 9, min: 7, max: 9 }
    },
    {
        code: 'GB',
        name: 'United Kingdom',
        dialCode: '+44',
        flag: '🇬🇧',
        cities: ['London', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Liverpool', 'Edinburgh', 'Manchester', 'Bristol'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 11 }
    },
    {
        code: 'US',
        name: 'United States',
        dialCode: '+1',
        flag: '🇺🇸',
        cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'UY',
        name: 'Uruguay',
        dialCode: '+598',
        flag: '🇺🇾',
        cities: ['Montevideo', 'Salto', 'Paysandú', 'Las Piedras', 'Rivera', 'Maldonado', 'Tacuarembó', 'Melo', 'Mercedes', 'Artigas'],
        phoneLength: { mobile: 8, landline: 8, min: 7, max: 8 }
    },
    {
        code: 'UZ',
        name: 'Uzbekistan',
        dialCode: '+998',
        flag: '🇺🇿',
        cities: ['Tashkent', 'Namangan', 'Samarkand', 'Andijan', 'Bukhara', 'Nukus', 'Qarshi', 'Kokand', 'Margilan', 'Fergana'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 9 }
    },
    {
        code: 'VU',
        name: 'Vanuatu',
        dialCode: '+678',
        flag: '🇻🇺',
        cities: ['Port Vila', 'Luganville', 'Isangel', 'Sola', 'Lenakel', 'Lakatoro', 'Norsup', 'Saratamata', 'Loltong', 'Whitegrass'],
        phoneLength: { mobile: 5, landline: 5, min: 5, max: 7 }
    },
    {
        code: 'VA',
        name: 'Vatican City',
        dialCode: '+39',
        flag: '🇻🇦',
        cities: ['Vatican City'],
        phoneLength: { mobile: 10, landline: 10, min: 10, max: 10 }
    },
    {
        code: 'VE',
        name: 'Venezuela',
        dialCode: '+58',
        flag: '🇻🇪',
        cities: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Ciudad Guayana', 'San Cristóbal', 'Maturín', 'Ciudad Bolívar', 'Cumana'],
        phoneLength: { mobile: 7, landline: 7, min: 7, max: 7 }
    },
    {
        code: 'VN',
        name: 'Vietnam',
        dialCode: '+84',
        flag: '🇻🇳',
        cities: ['Ho Chi Minh City', 'Hanoi', 'Haiphong', 'Da Nang', 'Bien Hoa', 'Hue', 'Nha Trang', 'Can Tho', 'Rach Gia', 'Qui Nhon'],
        phoneLength: { mobile: 9, landline: 9, min: 8, max: 10 }
    },
    {
        code: 'YE',
        name: 'Yemen',
        dialCode: '+967',
        flag: '🇾🇪',
        cities: ['Sanaa', 'Aden', 'Taizz', 'Al Hudaydah', 'Mukalla', 'Ibb', 'Dhamar', 'Amran', 'Saada', 'Sayyan'],
        phoneLength: { mobile: 9, landline: 9, min: 7, max: 9 }
    },
    {
        code: 'ZM',
        name: 'Zambia',
        dialCode: '+260',
        flag: '🇿🇲',
        cities: ['Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola', 'Mufulira', 'Luanshya', 'Arusha', 'Kasama', 'Chipata'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 10 }
    },
    {
        code: 'ZW',
        name: 'Zimbabwe',
        dialCode: '+263',
        flag: '🇿🇼',
        cities: ['Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 'Kwekwe', 'Kadoma', 'Masvingo', 'Chinhoyi', 'Norton'],
        phoneLength: { mobile: 9, landline: 9, min: 9, max: 10 }
    }
];