const Joi = require("joi");

const schema = Joi.object().keys({
    type: Joi.string().valid("rent", "house_share").required(),
    landlord_uuid: Joi.string().required(),
    address: {
        house_number: Joi.string().required(),
        street: Joi.string().required(),
        area: Joi.string().required(),
        city: Joi.string().required(),
        county: Joi.string().required(),
        eircode: Joi.string().required()
    },
    details: {
        dwelling: Joi.string().valid("studio", "apartment", "house").required(),
        description: Joi.string().required(),
        stay_caveats: Joi.string(),
        lease_length_months: Joi.number().required(),
        min_target_age: Joi.number().min(18).required(),
        max_target_age: Joi.number().min(18).required(),
        target_sex: Joi.array().items(Joi.string().valid("male", "female", "other", "couple")).required(),
        target_profession: Joi.array().items(Joi.string().valid("student", "professional")).required()
    },

    bedrooms: Joi.array().items(Joi.string().valid("single", "double", "twin")).required(),
    bathrooms: Joi.array().items(Joi.string().valid("ensuite", "shared").required()),
    images: Joi.array().items(Joi.string().required()),

    facilities: {
        washing_machine: Joi.boolean().required(),
        dryer: Joi.boolean().required(),
        parking: Joi.boolean().required(),
        wifi: Joi.boolean().required(),
        central_heating: Joi.boolean().required(),
        garden: Joi.boolean().required()
    },
    listing: {
        created: Joi.date().required(),
        updated: Joi.date(),
        expires: Joi.date().required(),
        plan: Joi.string().required(),
        status: Joi.string().required(),
        owner_occupied: Joi.boolean().required(),
        furnished: Joi.boolean().required(),
        ber: Joi.string().valid(
            "A1", "A2", "A3",
            "B1", "B2", "B3",
            "C1", "C2", "C3",
            "D1", "D2",
            "E1", "E2",
            "F",
            "G"
        )
    }
});

module.exports = {
    generateAddress: function (houseNumber, street, area, city, county, eircode) {
        return {
            house_number: houseNumber,
            street: street,
            area: area,
            city: city,
            county: county,
            eircode: eircode
        }
    },

    generateDetails: function (dwelling, description, stayCaveats, leaseLengthMonths, minAge, maxAge, targetSex, targetProfession) {
        return {
            dwelling: dwelling,
            description: description,
            stayCaveats: stayCaveats,
            lease_length_months: leaseLengthMonths,
            min_target_age: minAge,
            max_target_age: maxAge,
            target_sex: targetSex,
            target_profession: targetProfession,
        }
    },

    generateFacilities: function (hasWashingMachine, hasDryer, hasParking, hasWifi, hasCentralHeating, hasGarden) {
        return {
            washing_machine: hasWashingMachine,
            dryer: hasDryer,
            parking: hasParking,
            wifi: hasWifi,
            central_heating: hasCentralHeating,
            garden: hasGarden
        }
    },

    generateListing: function (plan, isOwnerOccupied, isFurnished, ber) {
        const creation = new Date();
        let expiry = new Date();
        expiry.setDate(creation.getDate() + 21);

        return {
            created: creation,
            updated: creation,
            expires: expiry,
            plan: plan,
            status: "active",
            owner_occupied: isOwnerOccupied,
            furnished: isFurnished,
            ber: ber
        }
    },

    generate: function (type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing) {
        return {
            type: type,
            landlord_uuid: String(landlordUuid),
            address: address,
            details: details,
            bathrooms: bathrooms,
            bedrooms: bedrooms,
            images: ["http://f1.thejournal.ie/media/2013/08/james-larkin-2-337x500.jpg"],
            facilities: facilities,
            listing: listing
        }
    },

    validate: function validate(o) {
        return Joi.validate(o, schema, {allowUnknown: true})
    }
};
