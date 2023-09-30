export const handleReplaceDynVar = (data: any, string: string) => {
    const regex = /{{(.*?)}}/g;
    const matches = string?.match(regex);

    if (matches) {
      let newStr = string;
      for (const match of matches) {
        const key = match?.replace("{{", "")?.replace("}}", "");
        newStr = newStr?.replace(match, key in data ? data[key] : "");
      }
      return newStr;
    }
    return string;
  };