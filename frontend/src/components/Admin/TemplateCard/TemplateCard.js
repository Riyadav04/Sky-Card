import React from 'react';
import './TemplateCard.css';
import Apis from '../../Apis';

export default function TemplateCard({ template, onSelect }) {
  const imageUrl = template.imageUrl?.startsWith("http")
    ? template.imageUrl
    : `${Apis.BASE_URL}${template.imageUrl}`;

  return (
    <div className="template-card">
      <img src={imageUrl} alt={template.title} />
      <h3>{template.title}</h3>
      <button onClick={() => onSelect(template)}>Select</button>
    </div>
  );
}
