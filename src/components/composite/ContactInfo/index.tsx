import React from 'react'
import { Mail, Phone, MapPin, Edit } from 'lucide-react'
import { User } from '@/types/apiResponse'

interface ContactInfoProps {
  user: User | null
  openEditProfile: () => void
}

const ContactInfo: React.FC<ContactInfoProps> = ({ user, openEditProfile }) => {
  // Parse phone number to extract country code and number
  const parsePhoneNumber = (phone: string) => {
    if (!phone) return { countryCode: '', phoneNumber: '' };
    
    const phoneClean = phone.trim().replace(/\s/g, '');
    // Extract country code (starts with +, followed by 2 digits)
    const countryCodeMatch = phoneClean.match(/^\+(\d{2})/);
    
    if (countryCodeMatch && phoneClean.length >= 13) {
      // Has country code, extract first 3 characters (+XX) and remaining 10 digits
      return {
        countryCode: `+${countryCodeMatch[1]}`,
        phoneNumber: phoneClean.substring(3).slice(0, 10)
      };
    } else {
      // Try to extract from digits only
      const digitsOnly = phoneClean.replace(/\D/g, '');
      if (digitsOnly.length >= 12) {
        return {
          countryCode: `+${digitsOnly.slice(0, 2)}`,
          phoneNumber: digitsOnly.slice(2, 12)
        };
      }
    }
    
    // Fallback: return as is
    return { countryCode: '', phoneNumber: phone };
  };

  const { countryCode, phoneNumber } = parsePhoneNumber(user?.phone_no || '');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 space-y-4 shadow-sm">
      <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4">Contact Information</h3>
      
      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
          <Mail size={18} strokeWidth={1.5} className="text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-light">Email</p>
          <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
        <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
          <Phone size={18} strokeWidth={1.5} className="text-green-500 dark:text-green-400" />
        </div>
        {user?.phone_no && countryCode && phoneNumber ? (
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-light">Phone</p>
            <div className="flex items-center">
              <p className="text-sm font-light text-gray-900 dark:text-gray-100">{countryCode}</p>
              <span className="text-sm font-light text-gray-900 dark:text-gray-100">-</span>
              <p className="text-sm font-light text-gray-900 dark:text-gray-100">{phoneNumber}</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-light">Phone</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-light text-gray-900 dark:text-gray-100">Not set</p>
              <Edit size={14} strokeWidth={1.5} className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" onClick={openEditProfile} />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
          <MapPin size={18} strokeWidth={1.5} className="text-purple-500 dark:text-purple-400" />
        </div>
        {user?.location ? (
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-light">Location</p>
            <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user?.location}</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-light">Location</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-light text-gray-900 dark:text-gray-100">Not set</p>
              <Edit size={14} strokeWidth={1.5} className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" onClick={openEditProfile} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactInfo