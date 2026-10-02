import { create } from 'zustand';

export interface SignUpFormData {
  fullName?: string;
  email?: string;
  password?: string;
  major?: string;
  academicYear?: string;
  bio?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
}

interface SignUpStore {
  formData: SignUpFormData;
  updateFormData: (data: Partial<SignUpFormData>) => void;
  resetForm: () => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  formData: {},
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () => set({ formData: {} }),
}));