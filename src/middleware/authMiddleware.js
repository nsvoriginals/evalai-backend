import jwt from 'jsonwebtoken';
import express from 'express'

export const middleware = (req, res, next) => {

    const token = req.header("Authorization") && req.header("Authorization").split(' ')[1];

    if (!token) {
        return res.status(403).json({
            message: "Authorization forbidden"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        next();
    } catch (e) {
        console.error(e)
        return res.status(401).json({
            message: "Invalid Authorization headers"
        })
    }

}