sr = 48000
ksmps = 64
nchnls=2
0dbfs=1

instr  1
  kpchbend = port(chnget:k("axis1") * -1, 0.05)
  kvibamp = port(chnget:k("axis3") * -.5 + 0.5, 0.05)
  kvibfreq = port(chnget:k("axis2") * 4 , 0.05)

  kfreq = p4 * semitone(kpchbend) 
  kfreq *= cent(oscili:k(kvibamp, kvibfreq) * 20)

  asig = vco2(1, kfreq) 
  asig += vco2(0.25, kfreq * 1.5) 

  kcut = port(chnget:k("axis0"), 0.05) * 2 + 11.5 
  asig = zdf_ladder(asig, cpsoct(kcut), 0.5) 

  asig *= expsegr(0.001, .05, 0.1, 2, 0.001)

  out(asig, asig)
endin

