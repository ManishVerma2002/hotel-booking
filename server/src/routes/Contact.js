 import express from 'express';

import {createContact, getAllContacts} from '../controller/Contact.js';

const router = express.Router();

router.post('/', createContact);
router.get("/get", getAllContacts);


export default router;