import { create } from 'zustand';

export interface SignUpFormData {
  fullName?: string;
  email?: string;
  password?: string;
  isStudent?: boolean;
  bio?: string;
  role?: string;
  skills?: string[];
  university?: string;
  major?: string;
  academicYear?: string;
  timeCommitment?: string;
  collaborationStyle?: string;
  projectDuration?: string;
  profileImage?: string | null;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
}

interface SignUpStore {
  formData: SignUpFormData;
  updateFormData: (data: Partial<SignUpFormData>) => void;
  clearCredentials: () => void;
  resetForm: () => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  formData: {},
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  clearCredentials: () =>
    set((state) => ({ formData: { ...state.formData, password: undefined } })),
  resetForm: () => set({ formData: {} }),
}));
