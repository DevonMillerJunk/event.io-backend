import axios from 'axios';
import loggerUtil from "../util/logger.util";
import { httpMethods } from "../constants";

class Radar {
    private liveSecret: string = 'prj_live_sk_482350eb98fd995c02f99138c9c9e516332a08c5';
    private livePublic: string = 'prj_live_pk_1b72dacf982ef2a93679e842b18b5fa00912bfbe';
    private radarURL: string = 'https://api.radar.io/v1';
    private logger = new loggerUtil("server");

    public getUsers = async () => {
        const result = await axios({
            method: httpMethods.GET,
            url: `${this.radarURL}/users`,
            responseType: 'json',
            headers: {
                Authorization: this.liveSecret
            }
        });
        return result.data;
    }

    public deleteUser = async (id: string) => {
        const result = await axios({
            method: httpMethods.DELETE,
            url: `${this.radarURL}/users/${id}`,
            responseType: 'json',
            headers: {
                Authorization: this.liveSecret
            }
        });
        return result.data.meta.code == 200;
    }

    public createGeofence = async (id: string, description: string, longitude: number, latitude: number) => {
        const result = await axios({
            method: httpMethods.POST,
            url: `${this.radarURL}/geofences`,
            responseType: 'json',
            headers: {
                Authorization: this.liveSecret
            },
            data: {
                description,
                externalId: id,
                type: 'circle',
                tag: 'event',
                radius: 500,
                coordinates: [longitude, latitude]
            }
        });
        return result.data;
    }

    public getUsersInGeofence = async (id: string) => {
        const result = await axios({
            method: httpMethods.GET,
            url: `${this.radarURL}/geofences/event/${id}/users`,
            responseType: 'json',
            headers: {
                Authorization: this.liveSecret
            }
        });
        return result.data.users;
    }

    public updateGeofence = async (id: string, description: string, longitude: number, latitude: number) => {
        const result = await axios({
            method: httpMethods.PUT,
            url: `${this.radarURL}/geofences/event/${id}`,
            responseType: 'json',
            headers: {
                Authorization: this.liveSecret
            },
            data: {
                description,
                type: 'circle',
                tag: 'event',
                radius: 500,
                coordinates: [longitude, latitude]
            }
        });
        return result.data;
    }

    public deleteGeofence = async (id: string) => {
        const result = await axios({
            method: httpMethods.DELETE,
            url: `${this.radarURL}/geofences/event/${id}`,
            responseType: 'json',
            headers: {
                Authorization: this.liveSecret
            }
        });
        return result.data.meta.code == 200;
    }

    public geocode = async (address: string) => {
        //TODO: fix, not currently working. Requires pricing plan in Radar.io
        // const result = await axios({
        //     method: httpMethods.GET,
        //     url: `https://www.mapquestapi.com/geocoding/v1/address`,
        //     data: {
        //         location: address,
        //         key: 'MwgqQ3loIAWPRyrIZNrficxWGTpx6vYa'
        //     }
        // });
        // return result;
    }

    public submitEvent = async (id: string, longitude: number, latitude: number) => {
        const result = await axios({
            method: httpMethods.POST,
            url: `${this.radarURL}/track`,
            responseType: 'json',
            headers: {
                Authorization: this.livePublic
            },
            data: {
                deviceId: 1,
                userId: id,
                latitude,
                longitude,
                accuracy: 60
            }
        });
        return result.data.user;
    }
}

export default new Radar();