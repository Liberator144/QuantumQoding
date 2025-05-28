# ⚡ QQ-Verse Quick Setup
## Get Running in 5 Minutes

> **Quick Setup Guide**  
> For complete setup instructions, see: **[Master Setup Guide](../guides/setup-master.md)**  
> For hands-on learning, see: **[First Quantum Experience Tutorial](../tutorials/01-first-quantum-experience.md)**  

---

## 🚀 One-Command Setup

```bash
# Clone and setup
git clone https://github.com/your-org/QuantumQoding.git
cd QuantumQoding
npm run setup
```

## 🎯 Start Development

```bash
# Start all services
npm run dev
```

**Access Points**:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Docs**: http://localhost:3001/docs

## ✅ Verify Installation

```bash
# Quick health check
npm run verify
```

**Expected Output**:
```
✅ Frontend: Running on port 5173
✅ Backend: Running on port 3001
✅ Database: Connected
✅ Quantum Coherence: 0.95 (Excellent)
✅ Consciousness Stream: Active
✅ Neural Fabric: Healthy
```

## 🚨 Common Issues

### Port Conflicts
```bash
# Kill conflicting processes
lsof -ti:3001,3002,5173 | xargs kill -9
npm run dev
```

### Node Version
```bash
# Use Node 18+
nvm use 18
npm run setup
```

### Dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Next Steps

1. **[Complete Setup](../guides/setup-master.md)** - Full setup documentation
2. **[First Tutorial](../tutorials/01-first-quantum-experience.md)** - Start learning
3. **[Component Library](../components/README.md)** - Explore components
4. **[API Guide](../api/README.md)** - API integration

---

*Need help? Check the **[Master Setup Guide](../guides/setup-master.md)** or **[Troubleshooting](../troubleshooting/README.md)***