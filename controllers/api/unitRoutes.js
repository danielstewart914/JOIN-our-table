const unitRouter = require('express').Router();
const { Unit } = require('../../models');

// GET all units
unitRouter.get('/units', async (req, res) => {
    try {
        const unitData = await Unit.findAll();
        res.status(200).json(unitData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET one unit by id
unitRouter.get('/units/:id', async (req, res) => {
    try {
        const unitData = await Unit.findByPk(req.params.id);
        if (!unitData) {
            res.status(404).json({ message: 'No unit found with that id!' });
            return;
        }
        res.status(200).json(unitData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST new unit
unitRouter.post('/units', async (req, res) => {
    try {
        const unitData = await Unit.create(req.body);
        res.status(200).json(unitData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// PUT update unit
unitRouter.put('/units/:id', async (req, res) => {
    try {
        const unitData = await Unit.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(unitData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// DELETE unit
unitRouter.delete('/units/:id', async (req, res) => {
    try {
        const unitData = await Unit.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(unitData);
    } catch (err) {
        res.status(500).json(err);
    }
});