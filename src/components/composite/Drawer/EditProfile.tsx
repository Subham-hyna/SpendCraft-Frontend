"use client"
import { Button, buttonVariants } from "@/components/atomic/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/atomic/drawer"
import { Input } from "@/components/atomic/input"
import { Label } from "@/components/atomic/label"
import { Spinner } from "@/components/atomic/spinner"
import { cn } from "@/lib/utils"
import React, { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store"
import { updateUser, fetchUser } from "@/store/thunks/authThunks"
import { toast } from "react-hot-toast"
import { Phone, MapPin } from "lucide-react"

interface EditProfileProps {
  trigger?: React.ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const EditProfile = ({ trigger, className, open: controlledOpen, onOpenChange }: EditProfileProps) => {
  const dispatch = useAppDispatch();
  const { user, update_user_loading } = useAppSelector((state) => state.auth);
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Initialize form when drawer opens
  useEffect(() => {
    if (open && user) {
      // Parse phone number if it exists (format: +911234567890 or 911234567890)
      if (user.phone_no) {
        const phone = user.phone_no.trim().replace(/\s/g, '');
        // Extract country code (starts with +, followed by 2 digits, or just 2 digits at start)
        const countryCodeMatch = phone.match(/^\+?(\d{2})/);
        if (countryCodeMatch && phone.length >= 12) {
          // Has country code, extract first 2 digits with plus
          setCountryCode(`+${countryCodeMatch[1]}`);
          // Extract remaining 10 digits
          const remaining = phone.substring(phone.startsWith('+') ? 3 : 2);
          setPhoneNumber(remaining.slice(0, 10));
        } else {
          // If format doesn't match, try to extract last 10 digits as phone number
          const digitsOnly = phone.replace(/\D/g, '');
          if (digitsOnly.length >= 12) {
            // Has country code, extract first 2 and last 10
            setCountryCode(`+${digitsOnly.slice(0, 2)}`);
            setPhoneNumber(digitsOnly.slice(2, 12));
          } else if (digitsOnly.length === 10) {
            // Only 10 digits, assume default country code
            setCountryCode('+91');
            setPhoneNumber(digitsOnly);
          } else {
            // Default
            setCountryCode('+91');
            setPhoneNumber('');
          }
        }
      } else {
        setCountryCode('+91');
        setPhoneNumber('');
      }
      setLocation(user.location || '');
      setPhoneError('');
    }
  }, [open, user]);

  const validatePhoneNumber = (code: string, number: string): boolean => {
    // Validate country code: should start with + and have exactly 2 digits
    const countryCodeRegex = /^\+\d{2}$/;
    if (!countryCodeRegex.test(code)) {
      setPhoneError('Country code must start with + followed by 2 digits');
      return false;
    }

    // Validate phone number: should be exactly 10 digits
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(number)) {
      setPhoneError('Phone number must be exactly 10 digits');
      return false;
    }

    setPhoneError('');
    return true;
  };

  const handlePhoneNumberChange = (value: string) => {
    // Only allow digits, limit to 10 digits
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(digitsOnly);
    if (phoneError) {
      validatePhoneNumber(countryCode, digitsOnly);
    }
  };

  const handleCountryCodeChange = (value: string) => {
    // Ensure it starts with + and only contains digits after +
    if (value === '') {
      setCountryCode('+');
      return;
    }
    if (!value.startsWith('+')) {
      setCountryCode('+' + value.replace(/\D/g, '').slice(0, 2));
    } else {
      const digitsOnly = value.replace(/[^\d+]/g, '');
      // Limit to 3 characters total (+ and 2 digits)
      if (digitsOnly.length <= 3) {
        setCountryCode(digitsOnly);
      }
    }
    if (phoneError) {
      const currentCode = value.startsWith('+') ? value : '+' + value.replace(/\D/g, '').slice(0, 2);
      validatePhoneNumber(currentCode, phoneNumber);
    }
  };

  const handleSubmit = async () => {
    // Check if phone number is incomplete (one field filled but not the other)
    const hasCountryCode = countryCode.length === 3 && countryCode.startsWith('+'); // +XX format
    const hasPhoneNumber = phoneNumber.length === 10;
    
    if (hasCountryCode || hasPhoneNumber) {
      // If either field is filled, both must be filled and valid
      if (!validatePhoneNumber(countryCode, phoneNumber) || !location.trim()) {
        return;
      }
    }

    const payload: { phone_no?: string; location?: string } = {};
    
    // Include phone_no: if both fields are filled, combine them (countryCode already has +); otherwise send empty string to clear
    if (hasCountryCode && hasPhoneNumber) {
      // Extract digits from country code (remove +) and combine
      const codeDigits = countryCode.replace('+', '');
      payload.phone_no = `+${codeDigits}${phoneNumber}`;
    } else {
      // Clear phone number if not fully filled
      payload.phone_no = '';
    }

    // Include location (can be empty string)
    payload.location = location || '';

    try {
      await dispatch(updateUser(payload)).unwrap();
      toast.success('Profile updated successfully');
      setOpen(false);
    } catch (err: any) {
      const errorMessage = err?.payload?.response?.data?.message || 
        err?.response?.data?.message || 
        err?.message || 
        'Failed to update profile. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {trigger && <DrawerTrigger className={className}>{trigger}</DrawerTrigger>}
      <DrawerContent className="dark:bg-gray-800">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>Update your phone number and location</DrawerDescription>
      </DrawerHeader>
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Phone Number */}
            <div>
              <Label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-2">
                  <Phone size={16} strokeWidth={1.5} />
                  Phone Number
                </div>
              </Label>
              <div className="flex gap-2">
                <div className="w-24">
                  <Input
                    type="text"
                    style={{ borderRadius: '8px' }}
                    placeholder="+91"
                    value={countryCode}
                    onChange={(e) => handleCountryCodeChange(e.target.value)}
                    className="w-full px-4 py-5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-transparent transition-all"
                    maxLength={3}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="tel"
                    style={{ borderRadius: '8px' }}
                    placeholder="1234567890"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                    className={cn(
                      "w-full px-4 py-5 bg-gray-50 dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all",
                      phoneError 
                        ? "border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-600" 
                        : "border-gray-200 dark:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-600"
                    )}
                    maxLength={10}
                  />
                </div>
              </div>
              {phoneError && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-2">{phoneError}</p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Enter country code with + (e.g., +91) and 10-digit phone number
              </p>
            </div>

            {/* Location */}
            <div>
              <Label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} strokeWidth={1.5} />
                  Location
                </div>
              </Label>
              <Input
                type="text"
                style={{ borderRadius: '8px' }}
                placeholder="e.g., Mumbai, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex gap-3 w-full">
              <DrawerClose 
                className={cn(buttonVariants({ variant: "outline" }), "w-full flex-1")}
                disabled={update_user_loading}
              >
                Cancel
        </DrawerClose>
              <Button 
                className="flex-1 bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={Boolean(
                  update_user_loading || 
                  !!phoneError || 
                  (countryCode.length === 3 && countryCode.startsWith('+') && phoneNumber.length !== 10) || 
                  (phoneNumber.length > 0 && (countryCode.length !== 3 || !countryCode.startsWith('+'))) ||
                  !location.trim()
                )}
              >
                {update_user_loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner className="w-4 h-4" />
                    Updating...
                  </span>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </div>
          </div>
        </div>
    </DrawerContent>
  </Drawer>
  )
}

export default EditProfile