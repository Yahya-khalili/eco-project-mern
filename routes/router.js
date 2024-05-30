const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const clients = require("../models/clientModel");
const commandes= require("../models/commandModel");
const produits = require("../models/produitModel");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
/* --- C R U D   C L I E N T S --- */
router.post("/client", async (req, res) => {
    const { nom, cin, email, adressLiv, tel } = req.body;

    if (!nom || !cin || !email || !adressLiv || !tel) {
        return res.status(400).send("Please fill all the data");
    }
    try {
        const pre_client = await clients.findOne({ cin: cin });
        if (pre_client) {
            return res.status(409).send("Client already exists");
        } 
        else {
            const addClient = new clients({ nom, cin, email, adressLiv, tel });
            await addClient.save();
            return res.status(201).json(addClient);
        }
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/clients", async (req, res) => {
    try {
        const client = await clients.find();
        res.status(200).json(client);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/client/:id", async (req, res) => {
    try {
        const client = await clients.findById(req.params.id);
        if (!client) {
            return res.status(404).send("Client not found");
        }
        res.status(200).json(client);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put("/client/:id", async (req, res) => {
    try {
        const updatedClient = await clients.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClient) {
            return res.status(404).send("Client not found");
        }
        res.status(200).json(updatedClient);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete("/client/:id", async (req, res) => {
    try {
        const deletedClient = await clients.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).send("Client not found");
        }
        res.status(200).json(deletedClient);
    } catch (err) {
        res.status(500).send(err);
    }
});



/* --- C R U D   P R O D U I T S --- */
router.post("/produit", async (req, res) => {
    const { libelle, prix, description } = req.body;

    if (!libelle || !prix || !description) {
        return res.status(400).send("Please fill all the data");
    }
    try {
        const addProduit = new produits({ libelle, prix, description });
        await addProduit.save();
        return res.status(201).json(addProduit);
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/produits", async (req, res) => {
    try {
        const produit = await produits.find();
        res.status(200).json(produit);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/produit/:id", async (req, res) => {
    try {
        const produit = await produits.findById(req.params.id);
        if (!produit) {
            return res.status(404).send("Produit not found");
        }
        res.status(200).json(produit);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put("/produit/:id", async (req, res) => {
    try {
        const updatedProduit = await produits.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduit) {
            return res.status(404).send("Produit not found");
        }
        res.status(200).json(updatedProduit);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete("/produit/:id", async (req, res) => {
    try {
        const deletedProduit = await produits.findByIdAndDelete(req.params.id);
        if (!deletedProduit) {
            return res.status(404).send("Produit not found");
        }
        res.status(200).json(deletedProduit);
    } catch (err) {
        res.status(500).send(err);
    }
});





/* --- C R U D   C O M M A N D E S --- */
router.post("/commande", async (req, res) => {
    const { client, produit, date_liv } = req.body;

    if (!client || !produit || !date_liv) {
        return res.status(400).send("Please fill all the data");
    }
    try {
        const addCommande = new commandes({ client, produit, date_liv });
        await addCommande.save();
        return res.status(201).json(addCommande);
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/commandes", async (req, res) => {
    try {
        const commande = await commandes.find().populate('client').populate('produit');
        res.status(200).json(commande);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/commande/:id", async (req, res) => {
    try {
        const commande = await commandes.findById(req.params.id).populate('client').populate('produit');
        if (!commande) {
            return res.status(404).send("Commande not found");
        }
        res.status(200).json(commande);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put("/commande/:id", async (req, res) => {
    try {
        const updatedCommande = await commandes.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCommande) {
            return res.status(404).send("Commande not found");
        }
        res.status(200).json(updatedCommande);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete("/commande/:id", async (req, res) => {
    try {
        const deletedCommande = await commandes.findByIdAndDelete(req.params.id);
        if (!deletedCommande) {
            return res.status(404).send("Commande not found");
        }
        res.status(200).json(deletedCommande);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ username, email, password });
        await user.save();

        const payload = { userId: user._id };
        const token = jwt.sign(payload, 'privateKey', { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
    expiresIn: '1h',
    });
    res.status(200).json({ token });
    } catch (error) {
    res.status(500).json({ error: 'Login failed' });
    }
    });




module.exports = router;

