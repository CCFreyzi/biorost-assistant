import { google } from 'googleapis';
import { readFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

export class GoogleSheetsService {
    private authClientPromise: Promise<any>;

    constructor() {
        const client_email = process.env.GOOGLE_CLIENT_EMAIL;
        const private_key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;

        let credentials;

        if (client_email && private_key) {
            credentials = { client_email, private_key };
        } else if (credentialsPath) {
            const absolutePath = path.resolve(credentialsPath);
            credentials = JSON.parse(readFileSync(absolutePath, 'utf8'));
        } else {
            throw new Error('Missing GOOGLE_CLIENT_EMAIL/GOOGLE_PRIVATE_KEY or GOOGLE_CREDENTIALS_PATH in .env');
        }

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: SCOPES,
        });

        this.authClientPromise = auth.getClient();
    }

    async readAsObjects(sheetName: string): Promise<Record<string, string>[]> {
        const rows = await this.readRange(sheetName);
        if (!rows.length) return [];

        const headers = rows[0];
        return rows.slice(1).map((row) => {
            const obj: Record<string, string> = {};
            headers.forEach((key, i) => {
                obj[key] = row[i] || '';
            });
            return obj;
        });
    }

    async getAllSheets(): Promise<string[]> {
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        if (!spreadsheetId) {
            throw new Error('Missing GOOGLE_SHEET_ID in .env');
        }

        const authClient = await this.authClientPromise;
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const response = await sheets.spreadsheets.get({ spreadsheetId });
        return response.data.sheets?.map((sheet) => sheet.properties?.title || '') || [];
    }

    async readRange(range: string = 'Sheet1'): Promise<string[][]> {
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        if (!spreadsheetId) {
            throw new Error('Missing GOOGLE_SHEET_ID in .env');
        }

        const authClient = await this.authClientPromise;
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        return response.data.values || [];
    }
}
