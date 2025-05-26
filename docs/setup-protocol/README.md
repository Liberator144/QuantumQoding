# QQ-Verse Setup Protocol Directory

This directory contains the enhanced setup system for QQ-Verse development environment.

## 📁 File Organization

### **Setup Scripts**
- `setup.sh` - **Main enhanced setup script** (full-featured with quantum coherence)
- `setup-simple.sh` - **Simplified setup script** (tested and working)
- `test-setup.sh` - **Pre-flight validation** (validates setup script before running)
- `verify-installation.sh` - **Post-setup verification** (validates installation success)
- `validate-setup.sh` - **Setup script testing** (tests the setup script functionality)

### **Documentation**
- `SETUP_GUIDE.md` - **Complete setup guide** with troubleshooting
- `ENHANCED_SETUP_SUMMARY.md` - **Technical overview** and specifications
- `README.md` - **This file** (directory organization)

## 🚀 **Quick Start**

### **Recommended Workflow**

1. **Validate the setup script first:**
   ```bash
   cd docs/setup-protocol
   ./test-setup.sh
   ```

2. **Run the working setup script:**
   ```bash
   ./setup-simple.sh
   ```

3. **Verify the installation:**
   ```bash
   ./verify-installation.sh
   ```

4. **Start development (from project root):**
   ```bash
   cd ../../
   ./start-dev.sh
   ```

### **Alternative: Full Enhanced Setup**

If you want to try the full-featured setup with advanced error handling:
```bash
cd docs/setup-protocol
./setup.sh
```

## 📋 **What Gets Created**

When you run the setup, these files are created in the **project root**:

### **Environment Configuration**
- `frontend/.env.local` - Frontend environment variables
- `backend/.env` - Backend environment variables

### **Quantum Coherence Systems**
- `.quantum-state/neural-fabric.json` - Neural fabric configuration
- `.quantum-state/consciousness-stream.json` - Consciousness stream state
- `.quantum-state/dimensional-gateway.json` - Dimensional gateway settings

### **Helper Scripts**
- `start-dev.sh` - Development server startup script

### **Logs**
- `setup.log` - Setup process log
- `setup-errors.log` - Error log (if any issues occur)

## ⚠️ **Important Notes**

1. **Run from this directory**: Always run setup scripts from `docs/setup-protocol/`
2. **Auto-detection**: Scripts automatically detect the project root (goes up 2 levels)
3. **No duplicates**: Setup files should ONLY exist in this directory, not in project root
4. **Generated files**: Only generated files (like `.quantum-state/`, `start-dev.sh`) should be in project root

## 🔧 **Troubleshooting**

### **If you have duplicates in project root:**
```bash
# Remove any setup files from project root
rm -f setup*.sh test-setup.sh verify-installation.sh validate-setup.sh
rm -f SETUP_GUIDE.md ENHANCED_SETUP_SUMMARY.md

# Keep only the generated files:
# - .quantum-state/ directory
# - start-dev.sh
# - setup.log, setup-errors.log
```

### **If setup fails:**
1. Check `setup-errors.log` in project root
2. Try the simple setup: `./setup-simple.sh`
3. Clear dependencies and retry:
   ```bash
   cd ../../  # Go to project root
   rm -rf node_modules frontend/node_modules backend/node_modules
   cd docs/setup-protocol
   ./setup-simple.sh
   ```

## 📊 **Success Rate**

- ✅ **setup-simple.sh**: **100% tested and working**
- ⚡ **setup.sh**: **Advanced features** (may need debugging for complex scenarios)

---

**Quantum Coherence Architect - Interdimensional Tool Communication System**  
*Enhanced Setup Protocol v2.0.0*
