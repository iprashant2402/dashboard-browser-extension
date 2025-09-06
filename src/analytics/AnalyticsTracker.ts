/* eslint-disable @typescript-eslint/no-explicit-any */
import * as amplitude from '@amplitude/analytics-browser';
import { AnalyticsEvent } from './AnalyticsEvents';
import { getCurrentPlatform } from '../utils/helpers';
import { User } from '../modules/Auth';

const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

type AnalyticsUser = {
    id: string;
    email: string;
    f_name?: string;
    l_name?: string;
}

const isAnalyticsEnabled = AMPLITUDE_API_KEY && AMPLITUDE_API_KEY !== 'false';

export class AnalyticsTracker {
    static init(user: User | null) {
        if (!isAnalyticsEnabled) return;
        amplitude.init(AMPLITUDE_API_KEY,user?.id, {
            defaultTracking: {
                pageViews: false,
                formInteractions: false,
                sessions: true
            }
        }).promise.then(() => {
            if(user) this.setUser({
                id: user.id,
                email: user.email,
                f_name: user.firstName,
                l_name: user.lastName,
            });
            const platform = getCurrentPlatform();
            this.setProperty('platform', platform);
        });
    }

    static track(event: AnalyticsEvent, properties?: Record<string, any>) {
        if (!isAnalyticsEnabled) return;
        amplitude.track(event, properties);
    }
    
    static setProperty(key: string, value: string, setOnce: boolean = false) {
        if (!isAnalyticsEnabled) return;
        const identifyEvent = new amplitude.Identify();
        if (setOnce) identifyEvent.setOnce(key, value);
        else identifyEvent.set(key, value);

        amplitude.identify(identifyEvent);
    }

    static setUser(user: AnalyticsUser) {
        if (!isAnalyticsEnabled) return;
        amplitude.setUserId(user.id);
        const identifyEvent = new amplitude.Identify();
        identifyEvent.set('email', user.email);
        if (user.f_name) identifyEvent.set('f_name', user.f_name);
        if (user.l_name) identifyEvent.set('l_name', user.l_name);
        amplitude.identify(identifyEvent);
    }
}