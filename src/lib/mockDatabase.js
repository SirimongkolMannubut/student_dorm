// In-Memory Database
let users = [
  {
    id: 'admin1',
    email: 'admin@sskru.ac.th',
    password: 'admin123',
    firstName: 'ผู้ดูแล',
    lastName: 'ระบบ',
    phone: '081-234-5678',
    role: 'admin',
    status: 'approved'
  }
];

export const mockDB = {
  // Find user by email or studentId
  findUser: (identifier) => {
    return users.find(user => 
      user.email === identifier || user.studentId === identifier
    );
  },

  // Find user by ID
  findUserById: (id) => {
    return users.find(user => user.id === id);
  },

  // Create new user
  createUser: (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date()
    };
    users.push(newUser);
    return newUser;
  },

  // Update user
  updateUser: (id, updateData) => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updateData };
      return users[userIndex];
    }
    return null;
  },

  // Check if user exists
  userExists: (email, studentId) => {
    return users.some(user => 
      user.email === email || user.studentId === studentId
    );
  }
};