import { Request, Response, NextFunction } from "express";
const request = require("express-validator");

/**
 * GET /
 * Home page.
 */
export let startMatch = (req: Request, res: Response) => {
    res.render("match", {
      title: "match title"
    });
    // request.get({
    //  url: "https://cig-prod-api.azurewebsites.net/api/articles/article/7214",
    //   json: true,
    //   headers: {
    //     "Authorization": "Token HHiQLYvZnkGqfD5xzxr/Sw",
    //     "content-type" : "application/json"
    //   }
    // }, function(error: any, response: any, body: any) {
    //   const _articleResponse = response.body;
    //   const _srcString = _articleResponse.d.replace(/\n/g, " ");

    //   res.render("home", {
    //     title: _articleResponse.t,
    //     seriesName: _articleResponse.ta,
    //     srcString: _srcString,
    //     tagsStartIndices: articleTextHelper.default.getIndicesOf("{{", _srcString),
    //     tagsEndIndices: articleTextHelper.default.getIndicesOf("}}", _srcString)
    //   });
    // });
  };

