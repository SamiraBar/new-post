import Office from '../models/Office';
import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { OfficeBody } from '../types';

export const getOffices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const offices = await Office.find({isActive: true});
    res.status(200).json(offices);
  } catch (e) {
    next(e);
  }
};
export const getAdminOffices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const offices = await Office.find();
    res.status(200).json(offices);
  } catch (e) {
    next(e);
  }
};

export const createOffice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, address, mapUrl, city, phone, worktime } = req.body;

    if (!name || !address || !mapUrl || !city || !phone || !worktime) {
      res.status(200).json({error: 'All fields are required'});
      return;
    }

    const existingOffice = await Office.findOne({ name, address });
    if (existingOffice) {
      res.status(400).json({error: 'Office with this name and address already exists'});
      return;
    }

    const office = new Office({
      name,
      address,
      mapUrl,
      city,
      phone,
      worktime
    });
    await office.save();

    res.status(201).json(office);
  } catch (e) {
    if (e instanceof Error && e.name === 'ValidationError') {
      res.status(400).json({error: e.message});
      return;
    }
    next(e);
  }
};

export const getOfficeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({error: 'Invalid office ID format'});
      return;
    }

    const office = await Office.findById(id);

    if (!office) {
      res.status(404).json({error: 'Office not found'});
      return;
    }

    res.status(200).json(office);
  } catch (e) {
    next(e);
  }
};

export const updateOffice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, address, mapUrl, isActive } = req.body;

    if (!isValidObjectId(id)) {
      res.status(400).json({error: 'Invalid office ID format'});
      return;
    }

    if (!name && !address && !mapUrl) {
      res.status(400).json({error: 'At least one field must be provided for update'});
      return;
    }

    const updateData: Partial<OfficeBody> = {
      ...(name !== undefined && { name }),
      ...(address !== undefined && { address }),
      ...(mapUrl !== undefined && { mapUrl }),
      ...(isActive !== undefined && { isActive }),
    };


    const office = await Office.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!office) {
      res.status(404).json({error: 'Office not found'});
      return;
    }

    res.status(200).json(office);
  } catch (e) {
    if (e instanceof Error && e.name === 'ValidationError') {
      res.status(400).json({error: e.message});
      return;
    }
    next(e);
  }
};


export const deleteOffice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({error: 'Invalid office ID format'});
      return;
    }

    const office = await Office.findByIdAndDelete(id);

    if (!office) {
      res.status(404).json({error: 'Office not found'});
      return;
    }

    res.status(200).json({
      message: 'Office deleted successfully',
      deletedOffice: office
    });
  } catch (e) {
    next(e);
  }
};