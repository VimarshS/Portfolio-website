import readline from 'readline';
import bcrypt from 'bcryptjs';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Type your admin password: ', async (password) => {
  rl.close();

  if (password.length < 10) {
    console.error('Use at least 10 characters.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);
  console.log('\nCopy this line into server/.env:\n');
  console.log(`ADMIN_PASSWORD_HASH='${hash}'`);
});