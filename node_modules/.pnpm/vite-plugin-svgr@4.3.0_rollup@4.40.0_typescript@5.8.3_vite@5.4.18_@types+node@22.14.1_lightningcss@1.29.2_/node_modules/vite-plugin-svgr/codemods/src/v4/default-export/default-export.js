module.exports = function (file, api) {
  const jscodeshift = api.jscodeshift;
  const root = jscodeshift(file.source);

  root.find(jscodeshift.ImportDeclaration).forEach((path) => {
    const importPath = path.node.source.value;

    if (importPath.endsWith(".svg")) {
      const hasDefaultSpecifier = path.node.specifiers.some((specifier) =>
        jscodeshift.ImportDefaultSpecifier.check(specifier),
      );

      // Skip transformation if there is a default import specifier
      if (!hasDefaultSpecifier) {
        const updatedImportPath = `${importPath}?react`;

        path.node.specifiers.forEach((specifier) => {
          if (jscodeshift.ImportSpecifier.check(specifier)) {
            // Convert named import to default import
            const newSpecifier = jscodeshift.importDefaultSpecifier(
              jscodeshift.identifier(specifier.local.name),
            );
            specifier.type = "ImportDefaultSpecifier";
            specifier.local = newSpecifier.local;
          }
        });

        path.node.source = jscodeshift.literal(updatedImportPath);
      }
    }
  });
  return root.toSource();
};
