/* Edit this file to complete author information, links, captions, and cases. */
window.PAGE = {
 assetRevision: '092d22d10f27', // cache refresh for copied videos and posters
 authors: [
  {
    "name": "Zekai Luo",
    "affiliation": "1",
    "markers": "*",
    "url": "https://viakai.github.io/"
  },
  {
    "name": "Yuwei Liang",
    "affiliation": "1",
    "markers": "*",
    "url": ""
  },
  {
    "name": "Ruiqi Ma",
    "affiliation": "1",
    "markers": "",
    "url": ""
  },
  {
    "name": "Haoyu Huang",
    "affiliation": "1",
    "markers": "",
    "url": ""
  },
  {
    "name": "Xuehao Wang",
    "affiliation": "1",
    "markers": "",
    "url": "https://scholar.google.com/citations?user=ZaJRYnMAAAAJ&hl=zh-CN"
  },
  {
    "name": "Huanyi Zheng",
    "affiliation": "1",
    "markers": "",
    "url": ""
  },
  {
    "name": "Mingyu Liu",
    "affiliation": "1",
    "markers": "",
    "url": "https://mingyulau.github.io/"
  },
  {
    "name": "Linhao Zhong",
    "affiliation": "1",
    "markers": "",
    "url": "https://scholar.google.com/citations?user=Qe8Gze4AAAAJ&hl=zh-CN"
  },
  {
    "name": "Chenchen Jing",
    "affiliation": "2",
    "markers": "",
    "url": "https://scholar.google.com/citations?user=0TKm3fgAAAAJ&hl=en"
  },
  {
    "name": "Yuling Xi",
    "affiliation": "1",
    "markers": "†",
    "url": "https://scholar.google.com/citations?hl=zh-CN&user=5n05YgoAAAAJ&view_op=list_works&sortby=pubdate"
  },
  {
    "name": "Hao Chen",
    "affiliation": "1",
    "markers": "†",
    "url": "https://stan-haochen.github.io/"
  }
],
 authorRowBreak: 6,
 authorNotes: "* Equal contribution · † Corresponding authors",
 contactEmails: ["luozekai@zju.edu.cn", "haochen.cad@zju.edu.cn"],
 affiliations: [
  {
    "id": "1",
    "name": "Zhejiang University"
  },
  {
    "id": "2",
    "name": "Zhejiang University of Technology"
  }
],
 links: {paper:'https://arxiv.org/abs/2610.26681', code:'https://github.com/aim-uofa/StreamingSwap', dataset:''},
 citation: `@misc{luo2026streamingswap,
  title={From Short Clips to Real-Time Streams: Identity-Aware Supervision and Context-Efficient Generation for Video Face Swapping},
  author={Zekai Luo and Yuwei Liang and Ruiqi Ma and Haoyu Huang and Xuehao Wang and Huanyi Zheng and Mingyu Liu and Linhao Zhong and Chenchen Jing and Yuling Xi and Hao Chen},
  year={2026},
  eprint={2610.26681},
  archivePrefix={arXiv},
  primaryClass={cs.CV},
  url={https://arxiv.org/abs/2610.26681}
}`,
 featured: {file:'realtime-live',label:'Real-time Streaming'},
 galleries: [
  {id:'film',label:'Professional Film',description:'Preserving Cinematic Realism',cases:[{file:'film-walter'},{file:'film-odyssey'}]},
  {id:'live',label:'Live',description:'Enabling Real-time Streaming',cases:[{file:'live-tim'},{file:'live-bidao'},{file:'live-jocker-xue-dehua'},{file:'live-weiya-liuyifei'}]},
  {id:'drama',label:'AI-generated Drama',description:'Enhancing Faithful Identity',cases:[{file:'drama-huaqiang'},{file:'drama-girl'}]}
 ],
 comparisons:{short:[{file:'comparison-short-1'},{file:'comparison-short-2'},{file:'comparison-short-113'},{file:'comparison-short-189'}],long:[{file:'comparison-long-1'},{file:'comparison-long-2'},{file:'comparison-long-108'},{file:'comparison-long-193'}]},
 // StreamingSwap.pdf, p.8, Table 1. Rows are verbatim numerical data.
 columns:['Method','ID Sim. ↑','Pose ↓','Expr. ↓','Light ↓','Gaze ↑','FVD ↓','FPS ↑','Latency (s) ↓'],
 shortRows:[['BlendFace',0.533,6.218,2.471,0.301,0.875,130.77,16.548,0.276],['InSwapper',0.735,6.084,2.624,0.252,0.873,138.09,28.621,0.050],['FaceAdapter',0.129,8.563,2.681,0.329,0.823,257.99,0.353,2.833],['VividFace',0.175,8.870,2.695,0.314,0.786,204.15,0.283,28.267],['VFace',0.373,11.258,3.004,0.366,0.761,252.24,0.129,20.662],['DreamID-V',0.734,9.338,3.009,0.509,0.764,231.00,1.815,44.891],['StreamingSwap (Ours)',0.577,5.354,2.484,0.242,0.881,129.09,21.174,1.782]],
 longRows:[['BlendFace',0.533,7.173,2.464,0.306,0.867,154.05,16.548,0.276],['InSwapper',0.723,6.701,2.584,0.248,0.867,147.01,28.621,0.050],['DreamID-V',0.715,10.827,2.967,0.489,0.798,249.41,1.815,44.891],['StreamingSwap (Ours)',0.576,6.336,2.466,0.238,0.881,136.23,21.174,1.782]]
};
