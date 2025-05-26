# QQ-Verse Setup Instructions

## 🎯 **Quick Setup**

The enhanced setup system is located in the `docs/setup-protocol/` directory.

### **Run Setup**

```bash
# Navigate to setup directory
cd docs/setup-protocol

# Run the tested setup script
./setup-simple.sh

# Verify installation
./verify-installation.sh

# Return to project root and start development
cd ../../
./start-dev.sh
```

### **Access Points After Setup**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 📁 **File Organization**

- **Setup files**: Located in `docs/setup-protocol/`
- **Generated files**: Created in project root (`.quantum-state/`, `start-dev.sh`, etc.)
- **Environment files**: `frontend/.env.local`, `backend/.env`

## 📖 **Full Documentation**

For complete documentation, see: `docs/setup-protocol/SETUP_GUIDE.md`

---

*If you see setup files in the project root, they are duplicates and should be removed.*  
*The setup system should only exist in `docs/setup-protocol/`*
