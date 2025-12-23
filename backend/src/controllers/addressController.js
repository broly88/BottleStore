import { Address } from '../models/index.js';

export const getUserAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.user.id },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (req, res, next) => {
  try {
    const { addressType, streetAddress, suburb, city, province, postalCode, isDefault } = req.body;

    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId: req.user.id } }
      );
    }

    const address = await Address.create({
      userId: req.user.id,
      addressType,
      streetAddress,
      suburb,
      city,
      province,
      postalCode,
      isDefault: isDefault || false,
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: {
        address,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { addressType, streetAddress, suburb, city, province, postalCode, isDefault } = req.body;

    const address = await Address.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found',
      });
    }

    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId: req.user.id } }
      );
    }

    const updates = {};
    if (addressType !== undefined) updates.addressType = addressType;
    if (streetAddress !== undefined) updates.streetAddress = streetAddress;
    if (suburb !== undefined) updates.suburb = suburb;
    if (city !== undefined) updates.city = city;
    if (province !== undefined) updates.province = province;
    if (postalCode !== undefined) updates.postalCode = postalCode;
    if (isDefault !== undefined) updates.isDefault = isDefault;

    await address.update(updates);

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: {
        address,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found',
      });
    }

    await address.destroy();

    res.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found',
      });
    }

    await Address.update(
      { isDefault: false },
      { where: { userId: req.user.id } }
    );

    address.isDefault = true;
    await address.save();

    res.json({
      success: true,
      message: 'Default address updated successfully',
      data: {
        address,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
