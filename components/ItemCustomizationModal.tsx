"use client";

import React, { useState } from 'react';
import { X, Flame, Sparkles, ShieldAlert, Info } from 'lucide-react';
import { formatMMK } from "@/lib/utils";
import { getImageUrl } from "@/lib/image-url";
export interface ModifierOption {
  id: string;
  name: string;
  price?: number;
}

export interface ModifierGroup {
  id: string;
  title: string;
  required: boolean;
  options: ModifierOption[];
}

export interface DetailedMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  calories?: string;
  isSpicy?: boolean;
  allergens?: string[];
  modifierGroups?: ModifierGroup[];
}

interface ModalProps {
  item: DetailedMenuItem | null;
  onClose: () => void;
}

export const ItemCustomizationModal: React.FC<ModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="relative w-full max-w-lg bg-[#121316] border border-white/10 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col text-[#F3F4F6]">
        
        {/* Header Image & Close Button */}
        <div className="relative h-60 w-full bg-zinc-900 shrink-0">
          <img 
            src={getImageUrl(item.image)} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 hover:bg-black transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Title & Price Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-white leading-snug">{item.name}</h2>
              <span className="text-lg font-extrabold text-[#D4AF37]">${item.price.toFixed(2)}</span>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>

            {/* Badges & Info */}
            <div className="flex items-center gap-3 pt-2">
              {item.calories && (
                <span className="text-[11px] font-medium text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                  {item.calories}
                </span>
              )}
              {item.isSpicy && (
                <span className="text-[11px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Spicy
                </span>
              )}
            </div>
          </div>

          {/* Allergen Notice */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200/90">
              <ShieldAlert className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#D4AF37]">Allergen Info: </span>
                Contains {item.allergens.join(', ')}.
              </div>
            </div>
          )}

          {/* Modifier / Ingredients Options */}
          {item.modifierGroups?.map((group) => (
            <div key={group.id} className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  {group.title}
                </h3>
                {group.required ? (
                  <span className="text-[10px] font-semibold text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                    Required
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-zinc-500 uppercase">Optional</span>
                )}
              </div>

              <div className="space-y-2">
                {group.options.map((option) => (
                  <div 
                    key={option.id}
                    className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-zinc-200">{option.name}</span>
                    {option.price ? (
                      <span className="text-xs font-semibold text-zinc-400">+${option.price.toFixed(2)}</span>
                    ) : (
                      <span className="text-xs text-emerald-400 font-medium">Included</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};