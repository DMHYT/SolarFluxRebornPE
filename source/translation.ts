(() => {
    const all_translation_keys: {[translation_key: string]: {[language: string]: string}} = {};
    const readFile = (name: string) => {
        let lines = FileTools.ReadText(`${__dir__}/res/lang/${name}.lang`).split("\n");
        for (let i in lines) {
            let line = lines[i];
            if (line.length == 0 || line.startsWith("#")) continue;
            let kv = line.split("=");
            all_translation_keys[kv[0]] ??= {};
            all_translation_keys[kv[0]][name] = kv[1];
        }
    }
    let files = FileTools.GetListOfFiles(`${__dir__}/res/lang/`, "");
    for (let i in files) readFile(new JavaString(files[i].getName()).replaceFirst("[.][^.]+$", ""));
    for (let key in all_translation_keys) {
        all_translation_keys[key][Translation.getLanguage()] ??= all_translation_keys[key].en;
        Translation.addTranslation(key, all_translation_keys[key]);
    }
})();
(() => {
    const obj = {en: "Inventory", ar: "جَرْدٌ", pt: "Inventário", zh: "存货", hr: "Inventar", cs: "Inventář", da: "Opgørelse", nl: "Inventaris", es: "Inventario", fi: "Inventaario", fr: "Inventaire", de: "Inventar", el: "κατάλογος απογραφέντων αντικειμένων", it: "Inventario", ja: "目録", ko: "품목 일람", nb: "Liste", pl: "Inwentarz", ro: "Inventar", ru: "Инвентарь", sv: "inventarieförteckning", th: "รายการสิ่งของ", tr: "Envanter", uk: "Iнвентар", vi: "bản kiểm kê"};
    obj[Translation.getLanguage()] ??= obj.en;
    Translation.addTranslation("sfr.inventory", obj);
})();