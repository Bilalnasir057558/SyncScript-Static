# SyncScript Static Version - Architecture & Implementation Plan

## 📋 Project Overview

**Project Name:** SyncScript - Knowledge Vault Management System  
**Tech Stack:** React + Vite + TailwindCSS + localStorage  
**Deployment:** GitHub Pages  
**Data Persistence:** Browser localStorage (no backend needed)

---

## 🎯 Core Features (MVP)

### **1. Authentication (localStorage-based)**
- Sign Up → Store user in localStorage
- Login → Validate credentials from localStorage
- Logout → Clear session
- Session persistence across page reloads

### **2. Dashboard**
- **My Vaults** section only (no sharing yet)
- List all user's vaults
- Quick stats (vault count, total resources)

### **3. Vault CRUD Operations**
- **Create:** Modal with name + description
- **Read:** Display vault card with preview
- **Update:** Edit vault details
- **Delete:** Remove vault with confirmation

### **4. Resources & Notes (Embedded in Vault)**
When creating/editing vault, inline editor for:
- **Resources (Links):** Title + URL
- **Notes:** Rich text editor (TinyMCE)
- Preview before saving
- Display in vault card

### **5. Notes/Annotations**
- Add notes to each resource
- View notes count on resource
- Simple text notes (no rich editor for notes)

---

## 📁 Project Structure

```
syncscript-static/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          (Header + logout button)
│   │   ├── Button.jsx           (Reusable button component)
│   │   ├── Modal.jsx            (Reusable modal wrapper)
│   │   ├── Input.jsx            (Reusable input component)
│   │   ├── VaultCard.jsx        (Display single vault)
│   │   ├── CreateVaultModal.jsx (Create/Edit vault + resources)
│   │   ├── ResourceForm.jsx     (Add/Edit resource inline)
│   │   ├── NotesEditor.jsx      (Add notes to resource - TinyMCE)
│   │   └── LoadingSpinner.jsx   (Loading state)
│   ├── pages/
│   │   ├── LandingPage.jsx      (Homepage with features)
│   │   ├── SignupPage.jsx       (Registration form)
│   │   ├── LoginPage.jsx        (Login form)
│   │   └── DashboardPage.jsx    (Main dashboard - My Vaults)
│   ├── hooks/
│   │   ├── useAuth.js           (Authentication logic)
│   │   ├── useVaults.js         (Vault CRUD logic)
│   │   └── useLocalStorage.js   (localStorage wrapper)
│   ├── utils/
│   │   ├── storage.js           (localStorage utilities)
│   │   ├── validation.js        (Form validation)
│   │   └── constants.js         (Constants & config)
│   ├── styles/
│   │   └── tailwind.css         (TailwindCSS config)
│   ├── App.jsx                  (Main app component + routing)
│   └── main.jsx                 (Entry point)
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 💾 Data Schema (localStorage)

### **Users Collection**
```javascript
{
  "users": [
    {
      "id": "user-1",
      "username": "alice",
      "email": "alice@email.com",
      "password": "hashed_password",  // ⚠️ For demo only, never in production!
      "createdAt": "2026-04-11"
    }
  ]
}
```

### **Current User Session**
```javascript
{
  "currentUser": {
    "id": "user-1",
    "username": "alice",
    "email": "alice@email.com",
    "token": "jwt-like-token",  // Generated on login
    "isLoggedIn": true
  }
}
```

### **Vaults Collection**
```javascript
{
  "vaults": [
    {
      "id": "vault-1",
      "createdBy": "user-1",
      "name": "DBMS Notes",
      "description": "Database management notes...",
      "resources": [
        {
          "id": "resource-1",
          "title": "SQL Tutorial",
          "url": "https://example.com/sql",
          "createdAt": "2026-04-11",
          "notes": [
            {
              "id": "note-1",
              "content": "Important for queries",
              "createdAt": "2026-04-11"
            }
          ]
        }
      ],
      "richNotes": "<p>Vault overview notes...</p>",  // TinyMCE content
      "createdAt": "2026-04-10",
      "updatedAt": "2026-04-11"
    }
  ]
}
```

---

## 🛠️ Implementation Phases

### **Phase 1: Setup & Authentication** (Day 1)
- [ ] Initialize Vite project + dependencies
- [ ] Create folder structure
- [ ] Implement useAuth hook
- [ ] Create SignupPage, LoginPage
- [ ] Setup routing with React Router
- [ ] Test auth flow

### **Phase 2: Dashboard & Vault List** (Day 2)
- [ ] Create DashboardPage layout
- [ ] Create VaultCard component
- [ ] Implement useVaults hook (CRUD)
- [ ] Test vault display

### **Phase 3: Vault CRUD** (Day 2-3)
- [ ] Create CreateVaultModal
- [ ] Implement create vault
- [ ] Implement update vault
- [ ] Implement delete vault with confirmation
- [ ] Test all CRUD operations

### **Phase 4: Resources & Notes** (Day 3-4)
- [ ] Install TinyMCE
- [ ] Create ResourceForm component
- [ ] Create NotesEditor component
- [ ] Add resources inline in CreateVaultModal
- [ ] Add notes to resources
- [ ] Display notes count on resource

### **Phase 5: UI/UX Polish** (Day 4)
- [ ] Add loading states
- [ ] Add success/error notifications
- [ ] Responsive design (mobile-first)
- [ ] Empty states
- [ ] Form validations

### **Phase 6: Landing Page** (Day 5)
- [ ] Create LandingPage
- [ ] Feature showcase
- [ ] Call-to-action buttons

### **Phase 7: Deployment** (Day 5)
- [ ] Setup GitHub repository
- [ ] Configure GitHub Pages
- [ ] Deploy to production
- [ ] Test live site

---

## 🔑 Key Implementation Details

### **Authentication Flow**
```javascript
// Sign Up
1. User enters username, email, password
2. Validate input
3. Check if user already exists
4. Hash password (use bcryptjs for frontend)
5. Store in localStorage under "users"
6. Auto-login user
7. Redirect to dashboard

// Login
1. User enters email/username + password
2. Find user in localStorage
3. Compare password hash
4. Generate JWT-like token
5. Store in "currentUser" session
6. Redirect to dashboard

// Logout
1. Clear currentUser from localStorage
2. Redirect to login/home
```

### **Vault CRUD with localStorage**
```javascript
// Create
const newVault = {
  id: generateUUID(),
  createdBy: currentUser.id,
  name: data.name,
  description: data.description,
  resources: data.resources || [],
  richNotes: data.richNotes || "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
// Add to vaults array in localStorage

// Read
const userVaults = vaults.filter(v => v.createdBy === currentUser.id);

// Update
const updated = { ...vault, ...updatedData, updatedAt: now };
// Replace in vaults array

// Delete
const filtered = vaults.filter(v => v.id !== vaultId);
// Update localStorage
```

### **Resources Inside Vault**
```javascript
// When creating vault, allow adding resources inline:
<CreateVaultModal>
  <input name="name" />
  <textarea name="description" />
  
  {/* Resources section */}
  <div>
    <h3>Add Resources</h3>
    {resources.map(r => (
      <ResourceItem key={r.id} resource={r} />
    ))}
    <button onClick={addResource}>+ Add Resource</button>
  </div>
  
  {/* Rich notes section */}
  <div>
    <h3>Vault Notes</h3>
    <TinyMCEEditor value={richNotes} onChange={setRichNotes} />
  </div>
</CreateVaultModal>
```

### **Notes on Resources**
```javascript
// In VaultCard or VaultDetail view
<Resource resource={resource}>
  <button onClick={toggleNotesPanel}>
    📝 Notes ({resource.notes.length})
  </button>
  
  {showNotes && (
    <NotesPanel>
      {resource.notes.map(note => (
        <NoteItem key={note.id} note={note} />
      ))}
      <input placeholder="Add note..." />
    </NotesPanel>
  )}
</Resource>
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "tinymce": "^6.x",
    "@tinymce/tinymce-react": "^4.x",
    "bcryptjs": "^2.x",
    "uuid": "^9.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "vite": "^4.x",
    "@vitejs/plugin-react": "^4.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

---

## 🎨 UI/UX Considerations

### **Landing Page**
```
┌─────────────────────────────────┐
│ Navbar (Logo + Sign Up/Login)   │
├─────────────────────────────────┤
│ Hero Section                    │
│ "Organize Your Knowledge"       │
│ [Sign Up] [Learn More]          │
├─────────────────────────────────┤
│ Features Grid (3 columns)       │
│ - Create Vaults                 │
│ - Store Resources               │
│ - Add Notes                      │
├─────────────────────────────────┤
│ CTA Section                     │
│ "Ready to get started?"         │
│ [Create Your First Vault]       │
├─────────────────────────────────┤
│ Footer                          │
└─────────────────────────────────┘
```

### **Dashboard**
```
┌─────────────────────────────────┐
│ Navbar + Logout + Profile       │
├─────────────────────────────────┤
│ "My Vaults"                     │
│ Stats: 5 Vaults | 23 Resources  │
│ [+ Create Vault]                │
├─────────────────────────────────┤
│ Vault Cards Grid (3 cols)       │
│ ┌──────────────┐                │
│ │ DBMS Notes   │ 5 resources    │
│ │ Created ...  │ Edit | Delete  │
│ └──────────────┘                │
│ ┌──────────────┐                │
│ │ AI Research  │ 3 resources    │
│ │ Created ...  │ Edit | Delete  │
│ └──────────────┘                │
└─────────────────────────────────┘
```

### **Vault Detail Modal**
```
┌────────────────────────────────────┐
│ Create/Edit Vault            [X]   │
├────────────────────────────────────┤
│ Vault Name: [_____________]        │
│ Description: [_____________]       │
│                                    │
│ Resources                          │
│ ┌──────────────────────────────┐  │
│ │ Link 1: SQL Tutorial         │  │
│ │ + Add Note | Remove          │  │
│ │                              │  │
│ │ Link 2: Design Patterns      │  │
│ │ + Add Note | Remove          │  │
│ └──────────────────────────────┘  │
│ [+ Add Resource]                   │
│                                    │
│ Vault Notes (Rich Editor)          │
│ ┌──────────────────────────────┐  │
│ │ [TinyMCE Editor]             │  │
│ │                              │  │
│ │                              │  │
│ └──────────────────────────────┘  │
│                                    │
│ [Cancel] [Save Vault]              │
└────────────────────────────────────┘
```

---

## 🔒 Security Notes (Important!)

⚠️ **This is a DEMO/LEARNING project:**
- ❌ Passwords stored in localStorage (NEVER in production!)
- ❌ No encryption (NEVER in production!)
- ❌ Client-side validation only (NEVER in production!)

**For production**, use:
- ✅ Backend with secure authentication
- ✅ HTTPS + secure cookies
- ✅ Password hashing (bcrypt server-side)
- ✅ JWT tokens with expiration
- ✅ CORS + CSRF protection

---

## 📊 Data Flow Diagram

```
User
  ↓
Login/Signup
  ↓ (store in localStorage)
Dashboard (fetch vaults from localStorage)
  ↓
Create Vault Modal
  ├─ Input: Name, Description
  ├─ Add Resources Inline
  ├─ Rich Notes Editor
  └─ Save to localStorage
  ↓
Dashboard shows updated vaults
  ↓
Click vault → View/Edit
  ├─ Update details
  ├─ Edit resources
  ├─ Add notes
  └─ Save changes
  ↓
Delete vault with confirmation
```

---

## 🚀 Deployment to GitHub Pages

```bash
# 1. Initialize git repo
git init

# 2. Create .gitignore
echo "node_modules/" > .gitignore

# 3. Setup Vite for GitHub Pages
# In vite.config.js:
export default {
  base: '/syncscript-static/',  // your repo name
  // ... rest of config
}

# 4. Update package.json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "npm run build && git add dist && git commit -m 'Deploy' && git push"
}

# 5. Create gh-pages branch and push
npm run build
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/syncscript-static.git
git push -u origin main

# 6. In GitHub: Settings → Pages → Deploy from branch "main" → folder "dist"

# 7. Live at: https://username.github.io/syncscript-static/
```

---

## ✅ Testing Checklist

- [ ] Sign up creates user in localStorage
- [ ] Login validates credentials correctly
- [ ] Logout clears session
- [ ] Session persists on page reload
- [ ] Can create vault with name + description
- [ ] Can add multiple resources to vault
- [ ] Can add rich notes to vault
- [ ] Can add text notes to resources
- [ ] Can edit vault details
- [ ] Can delete vault with confirmation
- [ ] Dashboard shows only current user's vaults
- [ ] Delete removes from localStorage
- [ ] Edit updates localStorage
- [ ] Mobile responsive layout
- [ ] No console errors
- [ ] Builds successfully
- [ ] Deploys to GitHub Pages

---

## 💡 Alternative Ideas (If Time Permits)

1. **Search/Filter vaults** by name or date
2. **Sort vaults** by creation date, name, resource count
3. **Export vault** as JSON or PDF
4. **Tags on vaults** for organization
5. **Color themes** for vaults
6. **Copy resource link** to clipboard
7. **Favorite vaults** (star system)
8. **Recent vaults** quick access
9. **Statistics dashboard** (total resources, vaults, etc.)
10. **Dark mode** toggle

---

## 📝 Course Submission Artifacts

For your engineering course, you'll need:

1. **LaTeX Documentation** (System overview, requirements)
2. **Microsoft Project Screenshot** (Task schedule)
3. **UML Diagrams** (Use case, class, sequence)
4. **Working System Code** (GitHub repo)
5. **SonarQube Analysis** (If applicable for frontend)
6. **Test Cases** (Manual testing plan)
7. **GitHub Repository Link**
8. **GitHub Pages Deployment Link**

---

## 🎯 Why This Approach is Better for Your Course

✅ **No backend debugging needed** - Focus on frontend + documentation  
✅ **Easy deployment** - GitHub Pages is free + simple  
✅ **Complete feature set** - CRUD, rich notes, resources all included  
✅ **Real user experience** - Feels like a real app  
✅ **Meets course requirements** - Multiple tools integration  
✅ **Extensible** - Can add backend later without changing architecture  

---

## 📚 Learning Outcomes

Students will learn:
- React hooks and state management
- localStorage API and data persistence
- Form handling and validation
- Component composition
- Routing and navigation
- Rich text editor integration (TinyMCE)
- Responsive design with TailwindCSS
- Deployment and DevOps basics
- UX/UI principles
- Data modeling for frontend applications

