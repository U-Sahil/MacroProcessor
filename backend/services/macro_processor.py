def run_macro_processor(code: str, mode: str):
    lines = [line.strip() for line in code.split("\n")]

    mnt = []
    mdt = []
    macro_table = {}

    in_macro = False
    macro_name = ""
    mdt_index = 1
    mnt_index = 1
    current_macro_lines = []

    expanded_code = []
    errors = []

    VALID_KEYWORDS = {"MACRO", "MEND", "SET", "ADD", "PRINT"}

    # PASS 1 (always)
    for line in lines:
        if not line:
            continue

        parts = line.split()
        keyword = parts[0]

        if keyword not in VALID_KEYWORDS and not in_macro:
            errors.append(f"Invalid keyword: {keyword}")
            continue

        if line == "MACRO":
            in_macro = True
            current_macro_lines = []
            macro_name = ""
            continue

        if in_macro:
            if line == "MEND":
                mdt.append({"index": mdt_index, "definition": "MEND"})
                mdt_index += 1

                macro_table[macro_name] = current_macro_lines.copy()
                in_macro = False
                continue

            if not macro_name:
                macro_name = parts[0]

                mnt.append({"index": mnt_index, "name": macro_name})
                mnt_index += 1

                mdt.append({"index": mdt_index, "definition": line})
                mdt_index += 1

                current_macro_lines.append(line)
            else:
                mdt.append({"index": mdt_index, "definition": line})
                mdt_index += 1

                current_macro_lines.append(line)

    # PASS 2
    if mode in ["pass2", "full"]:
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

            if word in macro_table:
                args = parts[1:]

                for m_line in macro_table[word]:
                    expanded = m_line
                    for i, arg in enumerate(args):
                        expanded = expanded.replace(f"&ARG{i+1}", arg)

                    expanded_code.append(expanded)
            else:
                expanded_code.append(line)

    return {
        "mnt": mnt,
        "mdt": mdt,
        "expandedCode": "\n".join(expanded_code),
        "errors": errors
    }