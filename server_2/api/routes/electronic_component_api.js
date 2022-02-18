"use strict";

const express = require("express");
const MySqlDB = require("../../model/mysql/mysql");
const ElectronicComponentService = require("../../service/electronic_component_service");
const { check_required_field_in_query } = require("../middlewares/util");
const { verify_token } = require("../middlewares");

const electronic_component_api = express.Router();

const mysql_db = new MySqlDB();
const electronic_component_service = new ElectronicComponentService(mysql_db);
const upload_excel_file = require("../middlewares/upload_excel_file");

electronic_component_api.get(
  "/list",
  verify_token,
  check_required_field_in_query(["project_id"]),
  async (req, res, next) => {
    const { project_id } = req.query;
    electronic_component_service
      .get_list_component(project_id)
      .then((data) => {
        if (data.length === 0) {
          return res
            .status(500)
            .json({ message: "list electronic components not found" });
        }
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
);

electronic_component_api.post(
  "/upload",
  verify_token,
  check_required_field_in_query(["project_id"]),
  upload_excel_file.single("file"),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(500).json({ message: "file not found" });
    }
    try {
      const { project_id } = req.query;
      await electronic_component_service.check_exist_project(project_id);
      const electronic_components =
        await electronic_component_service.read_excel_file(req.file.filename);
      const result = await electronic_component_service.post_list_component(
        electronic_components,
        project_id
      );
      return res.status(200).send({ message: result });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
);

module.exports = electronic_component_api;
