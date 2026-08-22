import React from 'react';
import { Bed, Utensils, Compass, Bus, Sparkles, Tag } from 'lucide-react';

export function CategoryBadge({ category }) {
  const cat = (category || 'Other').toLowerCase();

  const getIcon = () => {
    switch (cat) {
      case 'stay':
        return <Bed size={12} />;
      case 'food':
        return <Utensils size={12} />;
      case 'sightseeing':
        return <Compass size={12} />;
      case 'transport':
        return <Bus size={12} />;
      case 'activity':
        return <Sparkles size={12} />;
      default:
        return <Tag size={12} />;
    }
  };

  const getBadgeClass = () => {
    switch (cat) {
      case 'stay':
        return 'badge-stay';
      case 'food':
        return 'badge-food';
      case 'sightseeing':
        return 'badge-sightseeing';
      case 'transport':
        return 'badge-transport';
      case 'activity':
        return 'badge-activity';
      default:
        return 'badge-other';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {getIcon()}
      {category}
    </span>
  );
}
