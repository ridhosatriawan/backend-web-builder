import execQuery from "./database.js";

export async function display_element(kategori) {
  try {
    let data = await execQuery({
      sql: "SELECT A.kode, B.kategori, B.icon, A.script_css, A.script_html, A.script_js FROM (SELECT kode, script_css, script_html, script_js FROM `tbl_elements` WHERE framewrk= ?) as A INNER JOIN (SELECT kode, kategori, icon FROM `tbl_menu` WHERE kategori=?) as B ON A.kode = B.kode",
      values: ["bootstrap-html", kategori],
    });
    return data;
  } catch (error) {
    return error;
  }
}

export async function download_element(target, elems) {
  try {
    let data = await execQuery({
      sql:
        "select * from tbl_elements where framewrk= '" +
        target +
        "' and kode in(" +
        elems +
        ")",
    });
    return data;
  } catch (error) {
    return error;
  }
}

export async function input_element(data) {
  const value = Object.values(data);

  try {
    let data = await execQuery({
      sql: "insert into tbl_elements (framewrk,kode,script_html, script_css, script_js) values (?)",
      values: [value],
    });
    const Ok = "OK";
    return Ok;
  } catch (error) {
    return error;
  }
}
