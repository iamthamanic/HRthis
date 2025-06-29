import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { User, EmploymentType, EmploymentStatus, UserRole } from '../types';
import { cn } from '../utils/cn';

/**
 * Screen for adding new employees (Admin only)
 */
export const AddEmployeeScreen = () => {
  const navigate = useNavigate();
  const { createUser, isLoading } = useAuthStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Required fields
    email: '',
    firstName: '',
    lastName: '',
    role: 'EMPLOYEE' as UserRole,
    
    // Personal details
    privateEmail: '',
    phone: '',
    
    // Address
    street: '',
    postalCode: '',
    city: '',
    
    // Employment details
    position: '',
    department: '',
    weeklyHours: '40',
    employmentType: 'FULL_TIME' as EmploymentType,
    employmentStatus: 'ACTIVE' as EmploymentStatus,
    joinDate: new Date().toISOString().split('T')[0],
    vacationDays: '30',
    
    // Banking (optional)
    iban: '',
    bic: '',
  });

  /**
   * Handle form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position ist erforderlich';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Abteilung ist erforderlich';
    }

    // Numeric validations
    const weeklyHours = parseInt(formData.weeklyHours);
    if (isNaN(weeklyHours) || weeklyHours < 1 || weeklyHours > 60) {
      newErrors.weeklyHours = 'Wochenstunden müssen zwischen 1 und 60 liegen';
    }

    const vacationDays = parseInt(formData.vacationDays);
    if (isNaN(vacationDays) || vacationDays < 0 || vacationDays > 50) {
      newErrors.vacationDays = 'Urlaubstage müssen zwischen 0 und 50 liegen';
    }

    // IBAN validation (if provided)
    if (formData.iban && !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/.test(formData.iban.replace(/\s/g, ''))) {
      newErrors.iban = 'Ungültige IBAN';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare user data
      const userData: Omit<User, 'id' | 'organizationId'> = {
        email: formData.email.trim(),
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role,
        privateEmail: formData.privateEmail.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        position: formData.position.trim(),
        department: formData.department.trim(),
        weeklyHours: parseInt(formData.weeklyHours),
        employmentType: formData.employmentType,
        employmentStatus: formData.employmentStatus,
        joinDate: formData.joinDate,
        vacationDays: parseInt(formData.vacationDays),
        address: formData.street.trim() ? {
          street: formData.street.trim(),
          postalCode: formData.postalCode.trim(),
          city: formData.city.trim()
        } : undefined,
        bankDetails: formData.iban.trim() ? {
          iban: formData.iban.trim(),
          bic: formData.bic.trim() || undefined
        } : undefined,
        coinWallet: 0,
        coinProgress: 0,
        level: 1,
        teamIds: [],
      };

      // Create user
      await createUser(userData);
      
      // Navigate back to team management with success message
      navigate('/admin/team-management', { 
        state: { 
          message: `Mitarbeiter ${userData.name} wurde erfolgreich erstellt.`,
          type: 'success'
        }
      });
      
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ 
        submit: 'Fehler beim Erstellen des Mitarbeiters. Bitte versuchen Sie es erneut.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/admin/team-management')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium mb-4"
          >
            ← Zurück zum Team Management
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Neuen Mitarbeiter hinzufügen
          </h1>
          <p className="text-gray-600">
            Erstellen Sie ein neues Mitarbeiterkonto mit allen erforderlichen Informationen.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Grundinformationen</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail-Adresse *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errors.email ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="max.mustermann@firma.de"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rolle
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EMPLOYEE">Mitarbeiter</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="SUPERADMIN">Super Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vorname *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="Max"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nachname *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="Mustermann"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Kontaktinformationen</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Private E-Mail
                </label>
                <input
                  type="email"
                  name="privateEmail"
                  value={formData.privateEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="max.privat@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+49 30 12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Straße und Hausnummer
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Musterstraße 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PLZ
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stadt
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Berlin"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Beschäftigungsdetails</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errors.position ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="Senior Developer"
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abteilung *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errors.department ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="IT"
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wochenstunden
                </label>
                <input
                  type="number"
                  name="weeklyHours"
                  value={formData.weeklyHours}
                  onChange={handleInputChange}
                  min="1"
                  max="60"
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errors.weeklyHours ? "border-red-500" : "border-gray-300"
                  )}
                />
                {errors.weeklyHours && (
                  <p className="mt-1 text-sm text-red-600">{errors.weeklyHours}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschäftigungsart
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="FULL_TIME">Vollzeit</option>
                  <option value="PART_TIME">Teilzeit</option>
                  <option value="MINI_JOB">Minijob</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eintrittsdatum
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urlaubstage pro Jahr
                </label>
                <input
                  type="number"
                  name="vacationDays"
                  value={formData.vacationDays}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errors.vacationDays ? "border-red-500" : "border-gray-300"
                  )}
                />
                {errors.vacationDays && (
                  <p className="mt-1 text-sm text-red-600">{errors.vacationDays}</p>
                )}
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Bankverbindung (Optional)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN
                </label>
                <input
                  type="text"
                  name="iban"
                  value={formData.iban}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errors.iban ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="DE89 3704 0044 0532 0130 00"
                />
                {errors.iban && (
                  <p className="mt-1 text-sm text-red-600">{errors.iban}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BIC
                </label>
                <input
                  type="text"
                  name="bic"
                  value={formData.bic}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="COBADEFFXXX"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/team-management')}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={cn(
                "px-6 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors",
                "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                (isSubmitting || isLoading) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting || isLoading ? 'Erstelle Mitarbeiter...' : 'Mitarbeiter erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};