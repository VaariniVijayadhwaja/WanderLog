// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("author").title("Authors"),
      S.documentTypeListItem("travelblogs").title("Travelblogs"),
    ]);