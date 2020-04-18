import dotenv from 'dotenv';

export function config() {
    return dotenv.config({ path: process.env.DOTENV_PATH });
}
