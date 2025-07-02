import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface UserProfile {
  id: string;
  full_name?: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  avatar_url?: string;
  telegram_username?: string;
  whatsapp_number?: string;
  usdt_wallet?: string;
  role?: 'user' | 'admin';
}

interface ProfileContextType {
  profile: UserProfile | null;
  isAdmin: boolean;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        loadUserProfile(user.id);
      }, 0);
    } else {
      setProfile(null);
    }
  }, [user]);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      console.error('No user found for profile update');
      throw new Error('Пользователь не авторизован');
    }

    console.log('Updating profile for user:', user.id, 'with data:', profileData);

    // Очищаем пустые строки для полей дат
    const cleanedData = { ...profileData };
    if (cleanedData.birth_date === '') {
      cleanedData.birth_date = null;
    }
    
    // Очищаем другие пустые строки
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key as keyof UserProfile] === '') {
        cleanedData[key as keyof UserProfile] = null;
      }
    });

    console.log('Cleaned data:', cleanedData);

    try {
      // Сначала пробуем обновить существующий профиль
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...cleanedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        
        // Если профиль не найден, создаем новый
        if (updateError.code === 'PGRST116') {
          console.log('Profile not found, creating new one');
          const { data: insertData, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              ...cleanedData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (insertError) {
            console.error('Insert error:', insertError);
            console.error('Error details:', JSON.stringify(insertError, null, 2));
            throw new Error(`Ошибка создания профиля: ${insertError.message || insertError.details || 'Неизвестная ошибка'}`);
          }

          console.log('Profile created successfully:', insertData);
          setProfile(insertData as UserProfile);
        } else {
          console.error('Error details:', JSON.stringify(updateError, null, 2));
          throw new Error(`Ошибка обновления профиля: ${updateError.message || updateError.details || 'Неизвестная ошибка'}`);
        }
      } else {
        console.log('Profile updated successfully:', updateData);
        setProfile(updateData as UserProfile);
      }
      
      // Перезагружаем профиль из базы данных для синхронизации
      await loadUserProfile(user.id);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      isAdmin,
      updateProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
};