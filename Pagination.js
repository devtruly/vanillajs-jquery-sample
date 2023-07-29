class Pagination {
    _obj; _current; _pageSize; _totalCount;
    _lastPage; _pageLimit; _block; _start; _end;
    _url; _searchParams;
    constructor(obj, current = 1,
                pageSize = 10,
                totalCount = 0,
                pageLimit = 10,
                url = window.location.pathname,
                searchParams = {}
    )
    {
        this._obj = obj;
        this._current = current;
        this._pageSize = pageSize;
        this._totalCount = totalCount;
        this._pageLimit = pageLimit;
        this._url = url;
        this._searchParams = searchParams;

        this._lastPage = Math.ceil(this._totalCount / this._pageSize);
        this._block = Math.ceil(this._current / this._pageLimit);
        this._start = ((this._block - 1) * this._pageLimit) + 1;
        this._end = Math.min(this._lastPage, (this._start + this._pageLimit) - 1);

        this.setPagination();
    }

    setPageLink = (pageNumber) => {
        this._searchParams['pageNo'] = pageNumber;
        return `${this._url}?${Object.entries(this._searchParams).map(e => e.join("=")).join('&')}`;
    }

    setPagination() {
        let paginationList = [];

        if (this._start > 1) {
            paginationList.push(
                `<li><a href="${this.setPageLink(1)}"><i class="fa fa-angle-double-left"></i></a></li>`
            );
        }
        if (1 < this._current) {
            paginationList.push(
                `<li><a href="${this.setPageLink(this._current - 1)}"><i class="fa fa-angle-left"></i></a></li>`
            );
        }

        for (let i = this._start; i <= this._end; i++) {
            let currentPageClass = "";
            if (this._current == i) currentPageClass = "active";
            paginationList.push(
                `<li><a href="${this.setPageLink(i)}" class="page-number ${currentPageClass}">${i}</a></li>`
            );
        }

        if (this._current < this._lastPage) {
            paginationList.push(
                `<li><a href="${this.setPageLink(this._current + 1)}"><i class="fa fa-angle-right"></i></a></li>`
            );
        }

        if (this._end < this._lastPage) {
            paginationList.push(
                `<li><a href="${this.setPageLink(this._lastPage)}"><i class="fa fa-angle-double-right"></i></a></li>`
            );
        }
        this._obj.innerHTML = `<ul></ul>`;
        let pagination = this._obj.querySelector('ul');
        pagination.classList.add("pagination");
        pagination.classList.add("board-pagination");
        pagination.style.margin = "0 auto";
        pagination.style.height = "33px";
        pagination.innerHTML = paginationList.join("");
    }
}