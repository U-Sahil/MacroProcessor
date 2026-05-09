def run_macro_processor(code: str, mode: str):
    lines = [line.strip() for line in code.split("\n")]

    mnt = []
    mdt = []
    macro_table = {}

    in_macro = False
    macro_name = ""c
    mdt_index = 1
    mnt_index = 1
    current_macro_lines = []

    expanded_code = []
    errors = []

    VALID_KEYWORDS = {"MACRO", "MEND", "SET", "ADD", "PRINT", "START", "END"}

    # PASS 1
    for line in lines:
        if not line:
            continue

        parts = line.split()
        keyword = parts[0]

        if line == "MACRO":
            in_macro = True
            current_macro_lines = []
            macro_name = ""
            continue

        if in_macro:
            if line == "MEND":
                mdt.append({
                    "index": mdt_index,
                    "definition": "MEND"
                })
                mdt_index += 1

                macro_table[macro_name] = current_macro_lines.copy()
                in_macro = False
                continue

            if not macro_name:
                macro_name = parts[0]

                if macro_name in macro_table:
                    errors.append(f"Duplicate macro name: {macro_name}")
                    in_macro = False
                    continue

                mnt.append({
                    "index": mnt_index,
                    "name": macro_name
                })

                mnt_index += 1

                mdt.append({
                    "index": mdt_index,
                    "definition": line
                })

                mdt_index += 1

                current_macro_lines.append(line)

            else:
                mdt.append({
                    "index": mdt_index,
                    "definition": line
                })

                mdt_index += 1

                current_macro_lines.append(line)

        else:
            if keyword not in VALID_KEYWORDS and keyword not in macro_table:
                errors.append(f"Invalid keyword: {keyword}")

    # Missing MEND check
    if in_macro:
        if macro_name:
            errors.append(f"Missing MEND for macro: {macro_name}")
        else:
            errors.append("Missing MEND and macro name not defined")

    # PASS 2
    if mode in ["pass2", "full"]:

        ala_list = []   
        is_macro = False

        for line in lines:

            if not line:
                continue

            if line == "MACRO":
                is_macro = True
                continue

            if line == "MEND":
                is_macro = False
                continue

            if is_macro:
                continue

            parts = line.split()
            word = parts[0]

            # START and END
            if word in ["START", "END"]:
                expanded_code.append(line)
                continue

            # Macro expansion
            if word in macro_table:

                args = parts[1:]

                if len(args) == 0:
                    errors.append(f"Missing argument for macro {word}")
                    continue

                # Macro header
                header = macro_table[word][0]
                header_parts = header.split()

                # Formal parameters
                formal_params = header_parts[1:]

         
                if len(args) != len(formal_params):
                    errors.append(f"Incorrect number of arguments for macro {word}")
                    continue

              
                param_map = {}
                ala = []

                for i in range(len(formal_params)):
                    param = formal_params[i]
                    value = args[i]

                    param_map[param] = value
                    ala.append({
                        "param": param,
                        "value": value
                    })

                ala_list.append({
                    "macro": word,
                    "mapping": ala
                })

                # Expand macro body
                for m_line in macro_table[word][1:]:

                    expanded = m_line

                    for param, value in param_map.items():
                        expanded = expanded.replace(param, value)

                    expanded_code.append(expanded)

            else:
                expanded_code.append(line)

    return {
        "mnt": mnt,
        "mdt": mdt,
        "expandedCode": "\n".join(expanded_code),
        "errors": errors,
        "ala": ala_list if mode in ["pass2", "full"] else []
    }