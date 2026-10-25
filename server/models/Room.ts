import mongoose, { Schema, Document } from 'mongoose';

export interface IRoomDocument extends Document {
  roomNumber: string;
  title: string;
  type: string;
  pricePerNight: number;
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  sizeSqFt: number;
  view: string;
  floor: number;
  description: string;
  amenities: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoomDocument>(
  {
    roomNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    capacity: {
      guests: { type: Number, required: true, default: 2 },
      bedrooms: { type: Number, default: 1 },
      beds: { type: Number, default: 1 },
      bathrooms: { type: Number, default: 1 },
    },
    sizeSqFt: { type: Number, default: 350 },
    view: { type: String, default: 'City View' },
    floor: { type: Number, default: 1 },
    description: { type: String, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 12 },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

RoomSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

export const RoomModel = mongoose.models.Room || mongoose.model<IRoomDocument>('Room', RoomSchema);
