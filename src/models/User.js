import bcrypt from 'bcryptjs';

const users = [];

export default class User {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  static async create({ email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    users.push(user);
    return user;
  }

  static async findByEmail(email) {
    return users.find((u) => u.email === email);
  }

  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}
