 Collections.sort(list, new Comparator<News>() {
            public int compare(News arg0, News arg1) {
                int hits0 = arg0.getHits();
                int hits1 = arg1.getHits();
                if (hits1 > hits0) {
                    return 1;
                } else if (hits1 == hits0) {
                    return 0;
                } else {
                    return -1;
                }
            }
        });

使用Collections.sort进行对象的排序
