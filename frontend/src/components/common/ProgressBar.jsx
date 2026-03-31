import React from 'react';
import { Metin2GaugeBar } from '../metin2ui';

const TYPE_MAP = { hp: 'hp', mp: 'mp', stamina: 'st', exp: 'exp' };

export default function ProgressBar({ type = 'hp', current = 0, max = 100, showText = false }) {
  return (
    <Metin2GaugeBar
      type={TYPE_MAP[type] || 'hp'}
      current={current}
      max={max}
      showText={showText}
    />
  );
}
