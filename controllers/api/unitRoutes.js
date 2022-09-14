const unitRouter = require('express').Router();
const { Op } = require( 'sequelize' );
const { Unit } = require('../../models');

// GET all units
unitRouter.get('/', async (req, res) => {
    try {
        if ( !req.query.search ) {
            const unitData = await Unit.findAll( {
                order: [
                    [ 'unit_name', 'ASC' ]
                  ]
            } );
            res.status(200).json(unitData);
            return;
        }
        const { search } = req.query;

        console.log( search )

        const unitsData = await Unit.findAll( {
        where: {
            unit_name: {
            [Op.substring]: search
            }
        },
        order: [
            [ 'unit_name', 'ASC' ]
        ]
        } );
        res.status(200).json( unitsData );
    } catch (err) {
        res.status(500).json(err);
        
    }
});

// GET one unit by id
unitRouter.get('/:id', async (req, res) => {
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
unitRouter.post('/', async (req, res) => {
    try {
        const unitData = await Unit.create(req.body);
        res.status(200).json(unitData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// PUT update unit
unitRouter.put('/:id', async (req, res) => {
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
unitRouter.delete('/:id', async (req, res) => {
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

module.exports = unitRouter;