OBJDIR = build
AUX = .aux .log .toc .fls .fdb_latexmk .bbl .blg .out .lof .lot .bcf .run.xml

LMKCONT = -pvc -view=none
LMKOPTS = -shell-escape -pdf -output-directory=${OBJDIR}
LMKOPTS += `if [ -n "${CONT}" ]; then echo "${LMKCONT}"; fi`

LMKVARS = TEXINPUTS=${TEXINPUTS}:texmf
LATEXMK = ${LMKVARS} latexmk ${LMKOPTS}

.SUFFIXES: .pdf .tex

techdoc: techdoc/techdoc.pdf

.tex.pdf:
	${LATEXMK} $<

clean:
	for ft in ${AUX}; do rm -rf $$(find . -name "*$$ft"); done

distclean:
	rm -rf ${OBJDIR}
