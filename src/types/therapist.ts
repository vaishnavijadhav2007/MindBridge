export type ProfessionalType =
  | 'Clinical Psychologist'
  | 'Counseling Psychologist'
  | 'Psychiatrist'
  | 'Mental Health Counselor'
  | 'Therapist';

export type AllowedLanguage = 'English' | 'Hindi' | 'Marathi' | 'Telugu';

export type AreaOfPractice =
  | 'Anxiety and stress'
  | 'Academic pressure'
  | 'Depression and low mood'
  | 'Relationship and family concerns'
  | 'Sleep difficulties'
  | 'General emotional well-being';

export type ConsultationFormat = 'In-person' | 'Online' | 'Both';

export type PuneLocality =
  | 'Pune City (Shivaji Nagar)'
  | 'Pune City (Deccan Gymkhana)'
  | 'Kothrud'
  | 'Baner'
  | 'Aundh'
  | 'Wakad'
  | 'Hinjawadi'
  | 'Pimpri-Chinchwad'
  | 'Viman Nagar'
  | 'Kalyani Nagar'
  | 'Hadapsar';

export interface PuneTherapist {
  id: string;
  name: string;
  professionalType: ProfessionalType;
  credentials: string; // e.g. "M.Phil Clinical Psychology (RCI Reg.), Ph.D."
  registrationNumber?: string;
  clinicName?: string;
  district: 'Pune District, Maharashtra';
  locality: PuneLocality;
  address: string; // Verified physical address within Pune district
  languages: AllowedLanguage[]; // Strictly from English, Hindi, Marathi, Telugu
  areasOfPractice: AreaOfPractice[];
  consultationFormat: ConsultationFormat;
  consultationFee: {
    amount: number;
    currency: '₹';
    sessionDuration: string;
    isConfirmed: boolean;
  };
  experienceYears: number;
  availableSlot: string; // e.g. "Tomorrow at 3:00 PM" or "Contact clinic for upcoming slots"
  phone: string; // Simulated demo contact
  email: string;
  websiteUrl?: string;
  bio: string;
  approach: string;
  isDistrictVerified: boolean; // Must be true for Pune district verification
  isDemoListing: boolean; // Clearly indicates sample frontend profile
}

export interface TherapistFilterState {
  searchQuery: string;
  locality: PuneLocality | 'All';
  languages: AllowedLanguage[];
  professionalTypes: ProfessionalType[];
  areasOfPractice: AreaOfPractice[];
  format: 'All' | ConsultationFormat;
  sortBy: 'name-asc' | 'name-desc' | 'fee-asc' | 'fee-desc' | 'experience-desc';
}
