# F7-06 phone layout: taller tray chips so the miniature tile labels stay readable at 390.
EDITS=[
("""cols:m?4:8,chipW:m?105:108,chipH:m?48:54,chipGap:8,chipStep,trayX:m?27:30,trayY};}""","""cols:m?4:8,chipW:m?105:108,chipH:m?64:54,chipGap:8,chipStep,trayX:m?27:30,trayY};}"""),
("""const trayY=y+ht+(m?68:76),chipStep=m?59:64;""","""const trayY=y+ht+(m?68:76),chipStep=m?74:64;"""),
]
