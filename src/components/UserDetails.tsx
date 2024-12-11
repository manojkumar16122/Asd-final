import React from 'react';
import { UserData } from '../types';

interface Props {
  userData: UserData;
}

const getEmoji = (key: string): string => {
  const emojiMap: { [key: string]: string } = {
    name: '👤',
    age: '🎂',
    diagnosis: '📋',
    therapist: '👨‍⚕️',
    lastSession: '📅',
    progress: '📈',
    nextAppointment: '📆',
    modules: '📚'
  };
  return emojiMap[key] || '📝';
};

export default function UserDetails({ userData }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(userData).map(([key, value]) => (
        <div key={key} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span>{getEmoji(key)}</span>
            <p className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
          </div>
          <p className="font-medium mt-1 text-gray-800">{value}</p>
        </div>
      ))}
    </div>
  );
}