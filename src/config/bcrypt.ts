import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string);

export async function getHashedPassword(pwd: string): Promise<string> {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(pwd, salt);

    return hashedPassword;
}

export async function comparePassword(input: string, stored: string):Promise<Boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(input, stored, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    })
   
}