import mongoose = require("mongoose");

export interface attendee {
    userId: string,
    timeIn?: string,
    timeOut?: string
}

export interface IEventInterface {
    title: string,
    description: string,
    ownerId: string,
    attendees?: attendee[],
    timeline?: {
        startTime: string,
        endTime: string
    },
    location?: {
        lat: number,
        long: number
    }
}

export interface IEvent extends mongoose.Document {
    title: string,
    description: string,
    ownerId: string,
    attendees: attendee[],
    timeline: {
        startTime: string,
        endTime: string
    },
    location: {
        lat: number,
        long: number
    }
}

export const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    attendees: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        timeIn: { type: Date, required: false },
        timeOut: { type: Date, required: false },
    }],
    timeline: {
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false }
    },
    location: {
        latitude: { type: Number, required: false },
        longitude: { type: Number, required: false }
    }

});

export default mongoose.model<IEvent>("event", EventSchema);