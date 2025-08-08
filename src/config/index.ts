import dotenv from 'dotenv';

const envFound = dotenv.config();
if(envFound.error) {
    throw new Error(".env file not found");
}

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

export const portNumber = parseInt(process.env.SERVER_PORT as string);
export const frontendPath = process.env.REACT_BUILD_PATH as string;

