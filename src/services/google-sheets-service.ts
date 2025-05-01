import { google } from 'googleapis';
import { readFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

export class GoogleSheetsService {
    private authClientPromise: Promise<any>;

    constructor() {
        const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;
        if (!credentialsPath) {
            throw new Error('Missing GOOGLE_CREDENTIALS_PATH in .env');
        }

        const absolutePath = path.resolve(credentialsPath);
        const credentials = JSON.parse(readFileSync(absolutePath, 'utf8'));

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
        const sheetTitles = response.data.sheets?.map((sheet) => sheet.properties?.title || '') || [];

        return sheetTitles;
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
