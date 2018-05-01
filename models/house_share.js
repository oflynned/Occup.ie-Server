const Joi = require("joi");

const schema = Joi.object().keys({
    type: Joi.string().valid("house_share").required(),
    landlord_uuid: Joi.string().required(),
    bedrooms: Joi.string().valid("single", "double", "shared").required(),
    bathrooms: Joi.array().items(Joi.string().valid("ensuite", "shared").min(1).required()),
    images: Joi.array().items(Joi.string().required()).min(4).unique(),

    address: {
        house_number: Joi.string().required(),
        street: Joi.string().required(),
        area: Joi.string().required(),
        city: Joi.string().required(),
        county: Joi.string().required(),
        eircode: Joi.string().required()
    },

    details: {
        dwelling: Joi.string().valid("apartment", "house").required(),
        description: Joi.string().required(),
        lease_length_months: Joi.number().required(),
        min_target_age: Joi.number().min(18).required(),
        max_target_age: Joi.number().min(Joi.ref('min_target_age')).required(),
        target_tenant: Joi.array().items(Joi.string().valid("male", "female", "other", "couple")).min(1).unique().required(),
        target_profession: Joi.array().items(Joi.string().valid("student", "professional")).min(1).unique().required()
    },

    facilities: {
        dryer: Joi.boolean().required(),
        washing_machine: Joi.boolean().required(),
        central_heating: Joi.boolean().required(),
        parking: Joi.boolean().required(),
        pets: Joi.boolean().required(),
        wifi: Joi.boolean().required(),
        garden: Joi.boolean().required()
    },

    listing: {
        deposit: Joi.number().min(1).required(),
        rent: Joi.number().min(1).required(),
        created: Joi.date().required(),
        expires: Joi.date().required(),
        plan: Joi.string().valid("entry", "medium", "deluxe").required(),
        status: Joi.string().valid("open", "closed", "expired").required(),
        owner_occupied: Joi.boolean().required(),
        furnished: Joi.boolean().required(),
        ber: Joi.string().valid(
            "A1", "A2", "A3",
            "B1", "B2", "B3",
            "C1", "C2", "C3",
            "D1", "D2",
            "E1", "E2",
            "F", "G",
            "Exempt"
        ).required()
    }
});

module.exports = {
    generateAddress: function (apartmentNumber = undefined, houseNumber, street, area, city, county, eircode) {
        return {
            apartmentNumber: apartmentNumber,
            house_number: String(houseNumber),
            street: street,
            area: area,
            city: city,
            county: county,
            eircode: eircode
        }
    },

    generateDetails: function (dwelling, description, leaseLengthMonths, minAge, maxAge, targetTenant, targetProfession) {
        return {
            dwelling: dwelling,
            description: description,
            lease_length_months: leaseLengthMonths,
            min_target_age: minAge,
            max_target_age: maxAge,
            target_tenant: targetTenant,
            target_profession: targetProfession,
        }
    },

    generateFacilities: function (arePetsAllowed, hasWashingMachine, hasDryer, hasParking, hasWifi, hasCentralHeating, hasGarden) {
        return {
            pets: arePetsAllowed,
            washing_machine: hasWashingMachine,
            dryer: hasDryer,
            parking: hasParking,
            wifi: hasWifi,
            central_heating: hasCentralHeating,
            garden: hasGarden
        }
    },

    generateListing: function (plan, isOwnerOccupied, isFurnished, ber, deposit, rent) {
        const creation = new Date();
        let expiry = new Date();
        expiry.setDate(creation.getDate() + 21);

        return {
            deposit: parseInt(deposit),
            rent: parseInt(rent),
            created: creation,
            expires: expiry,
            plan: plan,
            status: "open",
            owner_occupied: isOwnerOccupied,
            furnished: isFurnished,
            ber: ber
        }
    },

    generate: function (landlordUuid, address, details, bathrooms, bedrooms, facilities, listing) {
        return {
            type: "house_share",
            landlord_uuid: String(landlordUuid),
            bathrooms: bathrooms,
            bedrooms: bedrooms,
            images: [
                "https://b.dmlimg.com/MDQ0NmY4MzAwY2VhYmFhZGRmY2JmNDk4MDA3MzEyODlxZGRX6azbb_50YdhwqtRuaHR0cDovL3MzLWV1LXdlc3QtMS5hbWF6b25hd3MuY29tL21lZGlhbWFzdGVyLXMzZXUvOC9mLzhmNzE2ODA4ZWUxZDk5MThmMDkyZmIwYmZiYjcwMWM3LmpwZ3x8fHx8fDYwMHg0NTB8fHx8.jpg",
                "https://b.dmlimg.com/MGFmZjg4ZjljYzdkMTJmNTlhMDgwZWI5MzE1ZGRlMGE3YL-cDCXeuZOsUmkVLsqZaHR0cDovL3MzLWV1LXdlc3QtMS5hbWF6b25hd3MuY29tL21lZGlhbWFzdGVyLXMzZXUvNC85LzQ5NGFkZDczN2RmZjgyMjJjMWY0NTE2YzM5MWRlYWYxLmpwZ3x8fHx8fDYwMHg0NTB8fHx8.jpg",
                "https://b.dmlimg.com/ZDIwNDFlZmY1NTBhYWJmYTQyZTY4NDM5MDQ3Mjk5ODXq1FI8tYeKcXln3fdrwwt9aHR0cDovL3MzLWV1LXdlc3QtMS5hbWF6b25hd3MuY29tL21lZGlhbWFzdGVyLXMzZXUvYi9hL2JhOGRjOTYzZTA5YTY5ZmIxYWQ4MjBiYWRkMWIwNzQ0LmpwZ3x8fHx8fDYwMHg0NTB8fHx8.jpg",
                "https://b.dmlimg.com/ODQ4MjI0Yjg5N2Q2MWIzOTgyODQzYTU5MzMzMzZlYTmxZrPBn3u2X0C_8a3Nff6TaHR0cDovL3MzLWV1LXdlc3QtMS5hbWF6b25hd3MuY29tL21lZGlhbWFzdGVyLXMzZXUvOS9lLzllN2ZmZWIyYTE1ODZiYmRhNjg1MTcyNTZhMzc2ODM4LmpwZ3x8fHx8fDM0MHgyNTV8fHx8.jpg"
            ],
            address: address,
            details: details,
            facilities: facilities,
            listing: listing
        }
    },

    validate: function validate(o) {
        return Joi.validate(o, schema, {allowUnknown: true});
    }
};
